package gov.fda.nctr.arlims.data_access.facts;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
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
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import static org.springframework.http.HttpMethod.GET;
import org.hobsoft.spring.resttemplatelogger.LoggingCustomizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.SampleOpDetails;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmission;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmissionResponse;


@Service
@Profile({"!dev"}) // LABS-DS api is unreachable from dev workstation (as opposed to dev server).
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
    private static final String SAMPLE_ANALYSES_MICROBIOLOGY_RESOURCE = "SampleAnalysesMicrobiology";

    private static final String UPPER_ALPHANUM ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    public LabsDSFactsAccessService
        (
            FactsApiConfig apiConfig,
            RestTemplateBuilder restTemplateBuilder
        )
    {
        this.apiConfig = apiConfig;
        this.restTemplate =
            restTemplateBuilder
            .setConnectTimeout(apiConfig.getConnectTimeout())
            .setReadTimeout(apiConfig.getReadTimeout())
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

        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonReader = jsonSerializer.reader();
        this.jsonWriter = jsonSerializer.writer();
    }

    @Override
    @Async
    public CompletableFuture<List<EmployeeInboxItem>> getEmployeeInboxItems
        (
            long employeeId,
            List<String> statusCodes
        )
    {
        // TODO: Add additional personal inbox fields here when supported by api: cfsanProductDesc, lid, paf, splitInd, samplingOrg.
        String includeFields =
          "workId,analysisSample,sampleTrackingSubNum,pacCode,statusCode,statusDate,subjectText,remarksText," +
          "registerTargetCompletionDate,personId,firstName,lastName,mdlIntlName,leadInd";

        UriComponentsBuilder uriBldr =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + EMPLOYEE_INBOX_RESOURCE)
            .queryParam("statusCodes", String.join(",", statusCodes))
            .queryParam("objectFilters", includeFields);

        String uri = uriBldr.build(false).encode().toUriString();

        HttpEntity reqEntity = new HttpEntity(newRequestHeaders(true, false));

        ResponseEntity<EmployeeInboxItem[]> resp =
            restTemplate.exchange(uri, GET, reqEntity, EmployeeInboxItem[].class);

        List<EmployeeInboxItem> inboxItems = Arrays.stream(resp.getBody()).collect(toList());

        return completedFuture(inboxItems);
    }

    @Override
    @Async
    public CompletableFuture<List<LabInboxItem>> getLabInboxItems
        (
            String orgName,
            List<String> statusCodes
        )
    {
        Optional<String> minAssignedToStatusDateStr = apiConfig.getLabInboxAssignedStatusAgeCutoffDays() > 0 ?
            Optional.of(LocalDate.now().minus(apiConfig.getLabInboxAssignedStatusAgeCutoffDays(), DAYS)
                .format(DateTimeFormatter.ofPattern("MM/dd/yyyy")))
            : Optional.empty();

        String includeFields =
            "workId,sampleTrackingNum,sampleTrackingSubNum,cfsanProductDesc,statusCode,statusDate,subject,pacCode," +
            "problemAreaFlag,lidCode,splitInd,workRqstId,operationCode,sampleAnalysisId," +
            "requestedOperationNum,requestDate,scheduledCompletionDate,samplingOrg,accomplishingOrg," +
            "accomplishingOrgId,fdaOrganizationId,responsibleFirmCode,rvMeaning,assignedToLeadInd," +
            "assignedToPersonId,assignedToFirstName,assignedToLastName,assignedToStatusCode,assignedToStatusDate," +
            "assignedToWorkAssignmentDate";

        UriComponentsBuilder uriBldr =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + LAB_INBOX_RESOURCE)
            .queryParam("accomplishingOrgName", orgName)
            .queryParam("statusCodes", String.join(",", statusCodes))
            .queryParam("objectFilters", includeFields);

        minAssignedToStatusDateStr.ifPresent(cutoffDateStr ->
            uriBldr.queryParam("statusDateFrom", cutoffDateStr)
        );

        String uri = uriBldr.build(false).encode().toUriString();

        HttpEntity reqEntity = new HttpEntity(newRequestHeaders(true, false));

        log.info("Retrieving inbox items for " + orgName + ".");

        ResponseEntity<LabInboxItem[]> resp =
            restTemplate.exchange(uri, GET, reqEntity, LabInboxItem[].class);

        List<LabInboxItem> inboxItems = Arrays.stream(resp.getBody()).collect(toList());

        return completedFuture(inboxItems);
    }

    @Override
    @Async
    // TODO: This won't work until LABS DS api supports the new fields requested here.
    public CompletableFuture<SampleOpDetails> getSampleOpDetails(long sampleOpId)
    {
        String includeFields = "workId,sampleTrackingNum,sampleTrackingSubNum,pacCode,cfsanProductDesc";

        String uri =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + WORK_DETAILS_RESOURCE)
            .queryParam("workId", sampleOpId)
            .queryParam("objectFilters", includeFields)
            .build(false).encode().toUriString();

        HttpEntity reqEntity = new HttpEntity(newRequestHeaders(true, false));

        ResponseEntity<SampleOpDetails> resp =
            restTemplate.exchange(uri, GET, reqEntity, SampleOpDetails.class);

        return completedFuture(resp.getBody());
    }

    @Override
    @Async
    public CompletableFuture<MicrobiologySampleAnalysisSubmissionResponse> submitMicrobiologySampleAnalysis
        (
            MicrobiologySampleAnalysisSubmission subm
        )
    {
        log.info(
            "Submitting microbiology sample analysis" +
            ( apiConfig.getLogSampleAnalysisSubmissionDetails() ? ":\n  " + toJson(subm) : "." )
        );

        HttpEntity<String> reqEntity =
            new HttpEntity<>(
                toJson(subm),
                newRequestHeaders(true, true)
            );

        ResponseEntity<MicrobiologySampleAnalysisSubmissionResponse> resp =
            restTemplate.exchange(
                apiConfig.getBaseUrl() + SAMPLE_ANALYSES_MICROBIOLOGY_RESOURCE,
                HttpMethod.POST,
                reqEntity,
                MicrobiologySampleAnalysisSubmissionResponse.class
            );

        // TODO: Maybe check for error response and incorporate into sample anlaysis response structure.
        MicrobiologySampleAnalysisSubmissionResponse res = resp.getBody();

        log.info(
            "Microbiology sample analysis submitted successfully" +
            ( apiConfig.getLogSampleAnalysisSubmissionDetails() ?
                " with response:\n  " + toJson(res)
                : "." )
        );

        return completedFuture(res);
    }

    @Override
    @Async
    public CompletableFuture<Void> updateSampleOpStatus(long sampleOpId, String statusCode)
    {
        // TODO: Send http req to update sample op status here when api endpoint is available.
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
            public void handleError(ClientHttpResponse response) throws IOException
            {
                JsonNode errorNode = jsonReader.readTree(response.getBody());
                log.info("LABS-DS api call resulted in error: " + errorNode.toString());

                super.handleError(response); // throws appropriate determined by status code
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

