package gov.fda.nctr.arlims.data_access.facts;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.hobsoft.spring.resttemplatelogger.LoggingCustomizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;


@Service
@Profile({"!dev"}) // LABS-DS api is unreachable from dev workstation (as opposed to dev server).
public class LabsDSFactsAccessService extends ServiceBase implements FactsAccessService
{
    private final FactsApiConfig apiConfig;

    private final JdbcTemplate jdbc;

    private final RestTemplate restTemplate;

    private final HttpHeaders fixedHeaders;

    private final SecureRandom secureRandom;

    private final ObjectReader jsonReader;

    private static final String LAB_INBOX_RESOURCE = "LabsInbox";
    private static final String WORK_DETAILS_RESOURCE = "WorkDetails";

    private static final String UPPER_ALPHANUM ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    public LabsDSFactsAccessService
        (
            FactsApiConfig apiConfig,
            JdbcTemplate jdbc,
            RestTemplateBuilder restTemplateBuilder
        )
    {
        this.apiConfig = apiConfig;
        this.jdbc = jdbc;
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
        log.info("Age cap for lab inbox items is " + apiConfig.getLabInboxAssignedStatusAgeCutoffDays() + " days.");

        HttpHeaders defaultRequestHeaders = new HttpHeaders();
        defaultRequestHeaders.add(HttpHeaders.AUTHORIZATION, authorizationHeaderValue(apiConfig));
        defaultRequestHeaders.add("sourceApplicationID", apiConfig.getAppId());
        this.fixedHeaders = defaultRequestHeaders;

        this.secureRandom = new SecureRandom();

        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonReader = jsonSerializer.reader();
    }

    public List<LabInboxItem> getLabInboxItems(List<String> statusCodes)
    {
        List<LabInboxItem> resInboxItems = new ArrayList<>();

        List<String> orgNames = jdbc.queryForList("select distinct facts_parent_org_name from lab_group", String.class);

        String includeFields =
            "workId,sampleTrackingNum,sampleTrackingSubNum,cfsanProductDesc,statusCode,statusDate,subject,pacCode," +
            "problemAreaFlag,lidCode,splitInd,workRqstId,operationCode,sampleAnalysisId," +
            "requestedOperationNum,requestDate,scheduledCompletionDate,samplingOrg,accomplishingOrg," +
            "accomplishingOrgId,fdaOrganizationId,responsibleFirmCode,rvMeaning,assignedToLeadInd," +
            "assignedToPersonId,assignedToFirstName,assignedToLastName,assignedToStatusCode,assignedToStatusDate," +
            "assignedToWorkAssignmentDate";

        Instant minAssignedToStatusTimestamp = Instant.now().minus(apiConfig.getLabInboxAssignedStatusAgeCutoffDays(), DAYS);

        for ( String orgName : orgNames )
        {
            // TODO: Add assignedToStatus age cutoff param here when available.
            String url =
                UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + LAB_INBOX_RESOURCE)
                .queryParam("orgName", orgName)
                .queryParam("statusCodes", String.join(",", statusCodes))
                .queryParam("objectFilters", includeFields)
                .toUriString();

            HttpEntity reqEntity = new HttpEntity(newRequestHeaders(true));

            log.info("Retrieving inbox items for " + orgName + ".");

            ResponseEntity<LabInboxItem[]> resp = restTemplate.exchange(url, HttpMethod.GET, reqEntity, LabInboxItem[].class);

            List<LabInboxItem> inboxItems =
                Arrays.stream(resp.getBody())
                .filter(item -> item.getAssignedToWorkAssignmentDate().compareTo(minAssignedToStatusTimestamp) >= 0)
                .collect(toList());

            if ( apiConfig.getLogLabInboxResults() )
                log.info(
                    "Retrieved " + inboxItems.size() + " inbox items for " + orgName + ":\n  " +
                    inboxItems.stream().map(Object::toString).collect(joining("\n  "))
                );

            inboxItems.forEach(resInboxItems::add);
        }

        return resInboxItems;
    }

    @Override
    public Optional<String> getWorkStatus(long workId)
    {
        String url =
            UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + WORK_DETAILS_RESOURCE)
            .queryParam("workId", workId)
            .queryParam("objectFilters", "statusCode")
            .toUriString();

        HttpEntity reqEntity = new HttpEntity(newRequestHeaders(true));

        ResponseEntity<StatusCodeObj[]> resp = restTemplate.exchange(url, HttpMethod.GET, reqEntity, StatusCodeObj[].class);

        StatusCodeObj[] statusCodeObjs = resp.getBody();

        if ( statusCodeObjs.length == 1 )
            return Optional.of(statusCodeObjs[0].statusCode);
        else
            return Optional.empty();
    }

    private HttpHeaders newRequestHeaders(boolean acceptJson)
    {
        HttpHeaders hdrs = new HttpHeaders();
        hdrs.addAll(fixedHeaders);
        hdrs.add("sourceTransactionID", generateApiTransactionId());
        if ( acceptJson )
            hdrs.setAccept(singletonList(new MediaType("application", "json", StandardCharsets.UTF_8)));
        return hdrs;
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
}

class StatusCodeObj
{
    String statusCode;
}
