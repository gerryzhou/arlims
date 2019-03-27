package gov.fda.nctr.arlims.data_access.facts;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import static java.time.temporal.ChronoUnit.DAYS;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import static java.util.Collections.singletonList;
import static java.util.concurrent.CompletableFuture.completedFuture;
import static java.util.stream.Collectors.toList;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.web.util.UriComponentsBuilder;
import static org.springframework.http.HttpMethod.GET;

import org.hobsoft.spring.resttemplatelogger.LoggingCustomizer;
import com.fasterxml.jackson.databind.*;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.*;
import gov.fda.nctr.arlims.models.dto.SampleTransfer;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.CreatedSampleAnalysisMicrobiology;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysis;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysesSubmissionResponse;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysesSubmission;


@Service
@Profile({"!fake-labsds"})
public class LabsDSFactsAccessService extends ServiceBase implements FactsAccessService
{
    private final FactsApiConfig apiConfig;

    private final RestTemplate restTemplate;

    private final HttpHeaders fixedHeaders;

    private final SecureRandom secureRandom;

    private final ObjectReader jsonReader;
    private final ObjectWriter jsonWriter;

    private static final String LAB_INBOX_RESOURCE = "LabsInbox";
    private static final String EMPLOYEE_INBOX_RESOURCE = "PersonInbox";
    private static final String WORK_DETAILS_RESOURCE = "WorkDetails";
    private static final String SAMPLE_TRANSFERS_RESOURCE = "SampleTransfers";
    private static final String SAMPLE_ANALYSES_MICROBIOLOGY_RESOURCE = "SampleAnalysesMicrobiology";
    private static final String SAMPLE_ANALYSES_RESOURCE = "SampleAnalyses";

    private static final String UPPER_ALPHANUM ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    public LabsDSFactsAccessService
        (
            FactsApiConfig apiConfig,
            RestTemplateBuilder restTemplateBuilder
        )
    {
        log.info("Initializing LABS-DS access service.");

        this.apiConfig = apiConfig;
        this.restTemplate =
            restTemplateBuilder
            .requestFactory(HttpComponentsClientHttpRequestFactory.class) // required for PATCH method support
            .setConnectTimeout(Duration.ofMillis(apiConfig.getConnectTimeout()))
            .setReadTimeout(Duration.ofMillis(apiConfig.getReadTimeout()))
            .customizers(new LoggingCustomizer())
            .build();
        restTemplate.setErrorHandler(getResponseErrorHandler());

        log.info("Setting API call connection and read timeouts to " +
            apiConfig.getConnectTimeout() + " and " +
            apiConfig.getReadTimeout() + " respectively.");
        log.info("Age cap for inbox items is " + apiConfig.getLabInboxAssignedStatusAgeCutoffDays() + " days.");

        HttpHeaders defaultRequestHeaders = new HttpHeaders();
        String authHeaderVal = authorizationHeaderValue(apiConfig);
        log.debug("Using auth header value \"" + authHeaderVal + "\" for Labs API calls.");
        defaultRequestHeaders.add(HttpHeaders.AUTHORIZATION, authHeaderVal);
        defaultRequestHeaders.add("sourceApplicationID", apiConfig.getAppId());
        this.fixedHeaders = defaultRequestHeaders;

        this.secureRandom = new SecureRandom();

        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().failOnUnknownProperties(true).build();
        this.jsonReader = jsonSerializer.reader();
        this.jsonWriter = jsonSerializer.writer();
    }

    @Override
    @Async
    public CompletableFuture<List<EmployeeInboxItem>> getEmployeeInboxItems
        (
            long employeeId,
            Optional<List<String>> statusCodes
        )
    {
        String includeFields =
            "operationId,sampleTrackingNumber,sampleTrackingSubNumber,sampleAnalysisId,cfsanProductDesc,lidCode," +
            "problemAreaFlag,pacCode,statusCode,statusDate,subjectText,remarks,personId,assignedToFirstName," +
            "assignedToLastName,assignedToMiddleName,leadIndicator,workAssignmentDate";

        UriComponentsBuilder uriBldr =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + EMPLOYEE_INBOX_RESOURCE)
            .queryParam("personId", employeeId)
            .queryParam("orderByFields", "workAssignmentDate:desc")
            .queryParam("objectFilters", includeFields);

        if ( statusCodes.isPresent() )
            uriBldr = uriBldr.queryParam("statusCodes", String.join(",", statusCodes.get()));

        String uri = uriBldr.build(false).encode().toUriString();

        HttpEntity req = new HttpEntity(newRequestHeaders(true, false));

        ResponseEntity<EmployeeInboxItem[]> resp = restTemplate.exchange(uri, GET, req, EmployeeInboxItem[].class);

        List<EmployeeInboxItem> inboxItems = Arrays.stream(resp.getBody()).collect(toList());

        return completedFuture(inboxItems);
    }

    @Override
    @Async
    public CompletableFuture<List<LabInboxItem>> getLabInboxItems
        (
            String orgName,
            Optional<List<String>> statusCodes
        )
    {
        Optional<String> minAssignedToStatusDateStr = apiConfig.getLabInboxAssignedStatusAgeCutoffDays() > 0 ?
            Optional.of(LocalDate.now().minus(apiConfig.getLabInboxAssignedStatusAgeCutoffDays(), DAYS)
                .format(DateTimeFormatter.ofPattern("MM/dd/yyyy")))
            : Optional.empty();

        String includeFields =
            "operationId,sampleTrackingNumber,sampleTrackingSubNumber,cfsanProductDesc,statusCode,statusDate," +
            "subject,pacCode,problemAreaFlag,workRequestId,operationCode,sampleAnalysisId,requestedOperationNum," +
            "requestDate,scheduledCompletionDate,accomplishingOrgName,accomplishingOrgId,responsibleFirmCode," +
            "leadIndicator,assignedToPersonId,assignedToFirstName,assignedToLastName,assignmentStatusCode," +
            "assignmentStatusDate,workAssignmentDate";

        UriComponentsBuilder uriBldr =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + LAB_INBOX_RESOURCE)
            .queryParam("accomplishingOrgName", orgName)
            .queryParam("objectFilters", includeFields);

        if ( statusCodes.isPresent() )
            uriBldr = uriBldr.queryParam("statusCodes", String.join(",", statusCodes.get()));

        if ( minAssignedToStatusDateStr.isPresent() )
            uriBldr = uriBldr.queryParam("statusDateFrom", minAssignedToStatusDateStr.get());

        String uri = uriBldr.build(false).encode().toUriString();

        HttpEntity req = new HttpEntity(newRequestHeaders(true, false));

        log.info("Retrieving inbox items for " + orgName + ".");

        ResponseEntity<LabInboxItem[]> resp = restTemplate.exchange(uri, GET, req, LabInboxItem[].class);

        List<LabInboxItem> inboxItems = Arrays.stream(resp.getBody()).collect(toList());

        return completedFuture(inboxItems);
    }

    @Override
    @Async
    // TODO: Test when Leidos adds product descr field in the result.
    public CompletableFuture<SampleOpDetails> getSampleOpDetails(long sampleOpId)
    {
        String includeFields =
            "operationId,sampleTrackingNumber,sampleTrackingSubNumber,programAssignmentCode,problemAreaFlag," +
            "cfsanProductDesc";

        String uri =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + SAMPLE_ANALYSES_RESOURCE)
            .queryParam("operationId", sampleOpId)
            .queryParam("objectFilters", includeFields)
            .build(false).encode().toUriString();

        HttpEntity req = new HttpEntity(newRequestHeaders(true, false));

        ResponseEntity<SampleOpDetails[]> resp = restTemplate.exchange(uri, GET, req, SampleOpDetails[].class);

        SampleOpDetails[] res = resp.getBody();

        if ( res.length != 1 )
            throw new RuntimeException(
                "Expected one result for sample op details for op " + sampleOpId + ", got " + res.length + "."
            );

        return completedFuture(res[0]);
    }

    @Override
    @Async
    public CompletableFuture<List<SampleTransfer>> getSampleTransfers
        (
            long sampleTrackingNumber,
            Optional<Long> toPersonId
        )
    {
        String includeFields =
            "sampleTrackingNumber,sampleTrackingSubNumber,receivedByPersonId,receivedByPersonFirstName," +
            "receivedByPersonLastName,receivedDate,receiverConfirmationInd,sentByPersonId,sentByPersonFirstName," +
            "sentByPersonLastName,sentDate,sentByOrgName,remarks";

        UriComponentsBuilder uriBuilder =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + SAMPLE_TRANSFERS_RESOURCE)
            .queryParam("sampleTrackingNumber", sampleTrackingNumber)
            .queryParam("objectFilters", includeFields);

        if ( toPersonId.isPresent() )
            uriBuilder = uriBuilder.queryParam("personId", toPersonId.get());

        String uri = uriBuilder.build(false).encode().toUriString();

        HttpEntity reqEntity = new HttpEntity(newRequestHeaders(true, false));

        ResponseEntity<SampleTransfer[]> resp = restTemplate.exchange(uri, GET, reqEntity, SampleTransfer[].class);

        List<SampleTransfer> transfers = Arrays.stream(resp.getBody()).collect(toList());

        return completedFuture(transfers);
    }

    @Override
    @Async
    public CompletableFuture<CreatedSampleAnalysisMicrobiology> submitMicrobiologySampleAnalysis
        (
            MicrobiologySampleAnalysis analysis
        )
    {
        MicrobiologySampleAnalysesSubmission subm = new MicrobiologySampleAnalysesSubmission(singletonList(analysis));

        String reqBody = toJson(subm);

        log.info(
            "Submitting microbiology sample analysis" +
            ( apiConfig.getLogSampleAnalysisSubmissionDetails() ? ":\n  " + reqBody : "." )
        );

        HttpEntity<String> reqEntity = new HttpEntity<>(reqBody, newRequestHeaders(true, true));

        ResponseEntity<MicrobiologySampleAnalysesSubmissionResponse> resp =
            restTemplate.exchange(
                apiConfig.getBaseUrl() + SAMPLE_ANALYSES_MICROBIOLOGY_RESOURCE,
                HttpMethod.POST,
                reqEntity,
                MicrobiologySampleAnalysesSubmissionResponse.class
            );

        log.info(
            "Microbiology sample analysis submitted successfully" +
            (apiConfig.getLogSampleAnalysisSubmissionDetails() ? " with response:\n  " + toJson(resp.getBody()) : ".")
        );

        int createdCount = resp.getBody().getSampleAnalysisMicrobiologyList().size();
        if ( createdCount != 1 )
        {
            throw new RuntimeException(
                "LABS-DS service returned " + createdCount + " result records for single " + "submission, expected 1."
            );
        }

        return completedFuture(resp.getBody().getSampleAnalysisMicrobiologyList().get(0));
    }

    @Override
    @Async
    public CompletableFuture<Void> updateWorkStatus
        (
            long sampleOpId,
            long personId,
            String statusCode
        )
    {
        String reqBody = toJson(new WorkDetailsStatusUpdateRequest(sampleOpId, personId, statusCode));

        log.info("Submitting work status update " + reqBody + ".");

        HttpEntity<String> reqEntity = new HttpEntity<>(reqBody, newRequestHeaders(true, true));

        restTemplate.exchange(
            apiConfig.getBaseUrl() + WORK_DETAILS_RESOURCE,
            HttpMethod.PATCH,
            reqEntity,
            Void.class
        );

        log.info("Work status updated.");

        return completedFuture(null);
    }

    private HttpHeaders newRequestHeaders(boolean acceptJson, boolean contentTypeJson)
    {
        HttpHeaders headers = new HttpHeaders();
        headers.addAll(fixedHeaders);
        headers.add("sourceTransactionID", generateApiTransactionId());
        if ( acceptJson )
            headers.setAccept(singletonList(new MediaType("application", "json", StandardCharsets.UTF_8)));
        if ( contentTypeJson )
            headers.setContentType(new MediaType("application", "json"));
        return headers;
    }

    private String generateApiTransactionId()
    {
        return randomAlphaNumericString(10);
    }

    private static String authorizationHeaderValue(FactsApiConfig apiConfig)
    {
        String creds = apiConfig.getAppOidUsername() + ":" + apiConfig.getAppOidPassword();
        String base64Creds = Base64.getEncoder().encodeToString(creds.getBytes(StandardCharsets.US_ASCII));
        return "Basic " + base64Creds;
    }

    private String randomAlphaNumericString(int length)
    {
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++)
            sb.append(UPPER_ALPHANUM.charAt(secureRandom.nextInt(UPPER_ALPHANUM.length())));

        return sb.toString();
    }

    private ResponseErrorHandler getResponseErrorHandler()
    {
        return new DefaultResponseErrorHandler() {
            @Override
            public void handleError(ClientHttpResponse response, HttpStatus statusCode) throws IOException
            {
                JsonNode errorNode = response.getBody() != null ? jsonReader.readTree(response.getBody()) : null;
                byte[] message = errorNode != null && errorNode.has("message") ?
                    errorNode.get("message").textValue().getBytes()
                    : null;

                log.info(
                    "LABS-DS api call resulted in error: " +
                    (errorNode != null ? errorNode.toString() : "<no response body>")
                );

                String statusText = response.getStatusText();
                HttpHeaders headers = response.getHeaders();
                Charset charset = this.getCharset(response);

                switch(statusCode.series())
                {
                    case CLIENT_ERROR:
                        throw HttpClientErrorException.create(statusCode, statusText, headers, message, charset);
                    case SERVER_ERROR:
                        throw HttpServerErrorException.create(statusCode, statusText, headers, message, charset);
                    default:
                        throw new UnknownHttpStatusCodeException(statusCode.value(), statusText, headers, message, charset);
                }
            }
        };
    }

    private String toJson(Object o)
    {
        try
        {
            return jsonWriter.writeValueAsString(o);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }
}

