package gov.fda.nctr.arlims.data_access.facts;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.*;

import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;


@Service
@Profile({"!dev"}) // LABS-DS api is unreachable from dev workstation (as opposed to "dev" server).
public class LabsDSFactsAccessService extends ServiceBase implements FactsAccessService
{
    private final FactsApiConfig apiConfig;

    private final JdbcTemplate jdbc;

    private final RestTemplate restTemplate;

    private final HttpHeaders fixedHeaders;

    private final SecureRandom secureRandom;

    private final ObjectReader jsonReader;

    private static final String LAB_INBOX_RESOURCE = "LabsInbox";

    private static final String UPPER_ALPHA_NUM_CHARS ="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    public LabsDSFactsAccessService
        (
            FactsApiConfig apiConfig,
            JdbcTemplate jdbc
        )
    {
        this.apiConfig = apiConfig;
        this.jdbc = jdbc;

        this.restTemplate = new RestTemplate();
        this.restTemplate.setErrorHandler(getResponseErrorHandler());

        HttpHeaders hdrs = new HttpHeaders();
        hdrs.add(HttpHeaders.CONTENT_TYPE, "application/json");
        hdrs.add(HttpHeaders.ACCEPT, "application/json");
        hdrs.add(HttpHeaders.AUTHORIZATION, authorizationHeaderValue(apiConfig));
        hdrs.add("sourceApplicationID", apiConfig.getAppId());
        this.fixedHeaders = hdrs;

        this.secureRandom = new SecureRandom();

        ObjectMapper jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonReader = jsonSerializer.reader();
    }

    public List<LabInboxItem> getLabInboxItems()
    {
        List<LabInboxItem> resInboxItems = new ArrayList<>();

        List<String> orgNames = jdbc.queryForList("select distinct facts_org_name from lab_group", String.class);

        String includeFields =
            "sampleTrackingNum,sampleTrackingSubNum,cfsanProductDesc,statusCode,statusDate,subject,pacCode," +
            "problemAreaFlag,lidCode,splitInd,workId,workRqstId,operationCode,sampleAnalysisId," +
            "requestedOperationNum,requestDate,scheduledCompletionDate,samplingOrg,accomplishingOrg," +
            "accomplishingOrgId,fdaOrganizationId,responsibleFirmCode,rvMeaning,assignedToLeadInd," +
            "assignedToPersonId,assignedToStatusCode,assignedToStatusDate,assignedToWorkAssignmentDate";

        for ( String orgName : orgNames )
        {
            String url =
                UriComponentsBuilder.fromHttpUrl(apiConfig.getBaseUrl() + LAB_INBOX_RESOURCE)
                .queryParam("orgName", orgName)
                .queryParam("objectFilters", includeFields)
                .toUriString();

            HttpEntity reqEntity = new HttpEntity(newRequestHeaders());

            ResponseEntity<LabInboxItem[]> resp = restTemplate.exchange(url, HttpMethod.GET, reqEntity, LabInboxItem[].class);

            LabInboxItem[] inboxItems = resp.getBody();

            log.info("Retrieved " + inboxItems.length + " inbox items for organization " + orgName + ".");

            Arrays.stream(inboxItems).forEach(resInboxItems::add);
        }

        return resInboxItems;
    }

    private HttpHeaders newRequestHeaders()
    {
        HttpHeaders hdrs = new HttpHeaders();
        hdrs.addAll(fixedHeaders);
        hdrs.add("sourceTransactionID", generateApiTransactionId());
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
            sb.append(UPPER_ALPHA_NUM_CHARS.charAt(secureRandom.nextInt(UPPER_ALPHA_NUM_CHARS.length())));

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


