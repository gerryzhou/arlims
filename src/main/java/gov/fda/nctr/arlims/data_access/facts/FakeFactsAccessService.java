package gov.fda.nctr.arlims.data_access.facts;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import static java.util.stream.Collectors.toList;


@Service
@Profile({"dev"})
public class FakeFactsAccessService implements FactsAccessService
{
    private final ObjectMapper jsonObjectMapper;

    FakeFactsAccessService()
    {
        this.jsonObjectMapper = Jackson2ObjectMapperBuilder.json().build();
    }

    @Override
    public List<LabInboxItem> getLabInboxItems(List<String> statusCodes, Optional<String> accomplishingOrg)
    {
        try
        {
            List<LabInboxItem> items = Arrays.asList(jsonObjectMapper.readValue(
                "[{" +
                "\"accomplishingOrg\": \"ARKL\",\n" +
                "\"accomplishingOrgId\": 123,\n" +
                "\"cfsanProductDesc\": \"SMOKED TROUT\",\n" +
                "\"operationCode\": \"43\",\n" +
                "\"pacCode\": \"04019A\",\n" +
                "\"lidCode\": null,\n" +
                "\"splitInd\": null,\n" +
                "\"problemAreaFlag\": \"ELE\",\n" +
                "\"requestDate\": \"2015-12-10 00:00:00.000-0500\",\n" +
                "\"responsibleFirmCode\": \"O\",\n" +
                "\"rvMeaning\": \"In Progress\",\n" +
                "\"sampleAnalysisId\": 875826,\n" +
                "\"sampleTrackingNum\": 804972,\n" +
                "\"sampleTrackingSubNum\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"I\",\n" +
                "\"statusDate\": \"2018-04-17 11:08:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"workId\": 6687466,\n" +
                "\"workRqstId\": 1508256,\n" +
                "\"assignedToFirstName\": \"Lynda\",\n" +
                "\"assignedToLastName\": \"Vidot\",\n" +
                "\"pacCodeDescription\": \"Toxic Elements in Foods (Domestic & Import)\",\n" +
                "\"assignedToAnlystTypeCode\": \"O\",\n" +
                "\"assignedToPersonId\": 1234567,\n" +
                "\"assignedToLeadInd\": \"Y\",\n" +
                "\"assignedToStatusCode\": \"I\",\n" +
                "\"assignedToStatusDate\": \"2018-04-17 00:00:00.000-0400\",\n" +
                "\"assignedToWorkAssignmentDate\": \"2018-04-17 11:04:16.000-0400\"" +
                "},{" +
                "\"accomplishingOrg\": \"ARKL\",\n" +
                "\"accomplishingOrgId\": 123,\n" +
                "\"cfsanProductDesc\": \"SMOKED SALMON\",\n" +
                "\"operationCode\": \"43\",\n" +
                "\"pacCode\": \"04019B\",\n" +
                "\"lidCode\": null,\n" +
                "\"splitInd\": null,\n" +
                "\"problemAreaFlag\": \"ELE\",\n" +
                "\"requestDate\": \"2015-12-09 00:00:00.000-0500\",\n" +
                "\"responsibleFirmCode\": \"O\",\n" +
                "\"rvMeaning\": \"In Progress\",\n" +
                "\"sampleAnalysisId\": 875825,\n" +
                "\"sampleTrackingNum\": 804971,\n" +
                "\"sampleTrackingSubNum\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"I\",\n" +
                "\"statusDate\": \"2018-03-16 11:08:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"workId\": 6587465,\n" +
                "\"workRqstId\": 1408255,\n" +
                "\"assignedToFirstName\": \"John\",\n" +
                "\"assignedToLastName\": \"Doe\",\n" +
                "\"pacCodeDescription\": \"Toxic Elements in Foods (Domestic & Import)\",\n" +
                "\"assignedToAnlystTypeCode\": \"O\",\n" +
                "\"assignedToPersonId\": 1234568,\n" +
                "\"assignedToLeadInd\": \"N\",\n" +
                "\"assignedToStatusCode\": \"I\",\n" +
                "\"assignedToStatusDate\": \"2018-04-16 00:00:00.000-0400\",\n" +
                "\"assignedToWorkAssignmentDate\": \"2018-04-16 11:04:16.000-0400\"" +
                "},{" +
                "\"accomplishingOrg\": \"ARKL\",\n" +
                "\"accomplishingOrgId\": 123,\n" +
                "\"cfsanProductDesc\": \"SMOKED SALMON\",\n" +
                "\"operationCode\": \"43\",\n" +
                "\"pacCode\": \"04019B\",\n" +
                "\"lidCode\": null,\n" +
                "\"splitInd\": null,\n" +
                "\"problemAreaFlag\": \"ELE\",\n" +
                "\"requestDate\": \"2015-12-09 00:00:00.000-0500\",\n" +
                "\"responsibleFirmCode\": \"O\",\n" +
                "\"rvMeaning\": \"In Progress\",\n" +
                "\"sampleAnalysisId\": 875825,\n" +
                "\"sampleTrackingNum\": 804971,\n" +
                "\"sampleTrackingSubNum\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"I\",\n" +
                "\"statusDate\": \"2018-03-16 11:08:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"workId\": 6587465,\n" +
                "\"workRqstId\": 1408255,\n" +
                "\"assignedToFirstName\": \"Lydia\",\n" +
                "\"assignedToLastName\": \"Vinot\",\n" +
                "\"pacCodeDescription\": \"Toxic Elements in Foods (Domestic & Import)\",\n" +
                "\"assignedToAnlystTypeCode\": \"O\",\n" +
                "\"assignedToPersonId\": 1234567,\n" +
                "\"assignedToLeadInd\": \"Y\",\n" +
                "\"assignedToStatusCode\": \"I\",\n" +
                "\"assignedToStatusDate\": \"2018-04-16 00:00:00.000-0400\",\n" +
                "\"assignedToWorkAssignmentDate\": \"2018-04-16 11:04:16.000-0400\"" +
                "},{" +
                "\"accomplishingOrg\": \"NFFL\",\n" +
                "\"accomplishingOrgId\": 123,\n" +
                "\"cfsanProductDesc\": \"TURKEY BREAST\",\n" +
                "\"operationCode\": \"43\",\n" +
                "\"pacCode\": \"04019C\",\n" +
                "\"lidCode\": null,\n" +
                "\"splitInd\": null,\n" +
                "\"problemAreaFlag\": \"ELE\",\n" +
                "\"requestDate\": \"2015-11-08 00:00:00.000-0500\",\n" +
                "\"responsibleFirmCode\": \"O\",\n" +
                "\"rvMeaning\": \"Pending\",\n" +
                "\"sampleAnalysisId\": 865824,\n" +
                "\"sampleTrackingNum\": 803970,\n" +
                "\"sampleTrackingSubNum\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"P\",\n" +
                "\"statusDate\": \"2018-03-15 10:07:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"workId\": 6487464,\n" +
                "\"workRqstId\": 1308253,\n" +
                "\"assignedToFirstName\": \"Yian\",\n" +
                "\"assignedToLastName\": \"Shooster\",\n" +
                "\"pacCodeDescription\": \"Toxic Elements in Foods (Domestic & Import)\",\n" +
                "\"assignedToAnlystTypeCode\": \"O\",\n" +
                "\"assignedToPersonId\": 1234567,\n" +
                "\"assignedToLeadInd\": \"Y\",\n" +
                "\"assignedToStatusCode\": \"I\",\n" +
                "\"assignedToStatusDate\": \"2018-03-15 00:00:00.000-0400\",\n" +
                "\"assignedToWorkAssignmentDate\": \"2018-03-15 10:03:15.000-0400\"" +
                "}]",
                LabInboxItem[].class
            ));

            return
                accomplishingOrg.isPresent() ?
                    items.stream()
                    .filter(item -> item.getAccomplishingOrg().equals(accomplishingOrg.get()))
                    .collect(toList())
                    : items;
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    public Optional<String> getWorkStatus(long workId)
    {
        return Optional.of("C");
    }
}
