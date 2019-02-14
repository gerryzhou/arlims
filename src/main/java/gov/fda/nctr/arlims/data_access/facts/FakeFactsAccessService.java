package gov.fda.nctr.arlims.data_access.facts;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import static java.util.concurrent.CompletableFuture.completedFuture;
import static java.util.stream.Collectors.toList;

import org.springframework.context.annotation.Profile;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.SampleOpDetails;
import gov.fda.nctr.arlims.models.dto.SampleTransfer;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmission;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmissionResponse;


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
    @Async
    public CompletableFuture<List<EmployeeInboxItem>> getEmployeeInboxItems(long empId, List<String> statusCodes)
    {
        try
        {
            List<EmployeeInboxItem> items = Arrays.asList(jsonObjectMapper.readValue(
                "[\n" +
                "  {\n" +
                "    \"analysisSample\": 848447,\n" +
                "    \"leadInd\": \"N\",\n" +
                "    \"operationCode\": \"41\",\n" +
                "    \"personId\": 472629,\n" +
                "    \"remarksText\": \"Check analyst update after complete\",\n" +
                "    \"rvMeaning\": \"In Progress\",\n" +
                "    \"sampleAnalysisId\": 893682,\n" +
                "    \"sampleTrackingSubNum\": 0,\n" +
                "    \"statusCode\": \"I\",\n" +
                "    \"statusDate\": \"2019-01-12 14:45:02-0400\",\n" +
                "    \"subjectText\": \"Adhoc Sample Analysis\",\n" +
                "    \"workDetailId\": 8541235,\n" +
                "    \"workId\": 6906100,\n" +
                "    \"workRequestId\": 1717465,\n" +
                "    \"workDetailRowId\": \"AAAEpNAAPAAFoMrAAB\",\n" +
                "    \"firstName\": \"Steve\",\n" +
                "    \"lastName\": \"Harris\",\n" +
                "    \"pacCode\": \"71001\",\n" +
                "    \"pacCodeDescription\": \"ANIMAL DRUG MANUFACTURING INSPECTIONS - GMP/NON GENERIC\"\n" +
                "  },\n" +
                "  {\n" +
                "    \"leadInd\": \"Y\",\n" +
                "    \"operationCode\": \"11\",\n" +
                "    \"personId\": 472629,\n" +
                "    \"reviewRequiredInd\": \"N\",\n" +
                "    \"registerTargetCompletionDate\": \"9/30/13 12:00 AM\",\n" +
                "    \"rvMeaning\": \"Assigned\",\n" +
                "    \"statusCode\": \"S\",\n" +
                "    \"statusDate\": 1544540699000,\n" +
                "    \"subjectText\": \"Trip 2013-052F\",\n" +
                "    \"workDetailId\": 8540981,\n" +
                "    \"workId\": 6482481,\n" +
                "    \"workRequestId\": 1474494,\n" +
                "    \"workDetailRowId\": \"AAAEpNAAPAAFoNiAAM\",\n" +
                "    \"firstName\": \"Steve\",\n" +
                "    \"lastName\": \"Harris\",\n" +
                "    \"pacCodeDescription\": \"DOMESTIC FOOD SAFETY PROGRAM INSPECTIONS\"\n" +
                "  }\n" +
                "]",
                EmployeeInboxItem[].class
            ));

            return completedFuture(items);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Async
    public CompletableFuture<List<LabInboxItem>> getLabInboxItems(String orgName, List<String> statusCodes)
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

            return completedFuture(items);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Async
    public CompletableFuture<SampleOpDetails> getSampleOpDetails(long sampleOpId)
    {
        try
        {
            SampleOpDetails sample = jsonObjectMapper.readValue(
                "\"{workId\": 123456,\n" +
                "\"sampleTrackingNum\": 804972,\n" +
                "\"sampleTrackingSubNum\": 0,\n" +
                "\"pacCode\": \"04019A\",\n" +
                "\"cfsanProductDesc\": \"SMOKED TROUT\"}",
                SampleOpDetails.class
            );

            return completedFuture(sample);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Async
    public CompletableFuture<List<SampleTransfer>> getSampleTransfers(long sampleTrackingNum, Optional<Long> toPersonId)
    {
        try
        {
            SampleTransfer[] transfers =
                jsonObjectMapper.readValue(
                    "[" +
                        "{" +
                        "\"sampleTrackingNum\":852325,\"sampleTrackingSubNum\":0," +
                        "\"receivedByPersonId\":472629," +
                        "\"receivedByPersonFirstName\":\"Tripti\"," +
                        "\"receivedByPersonLastName\":\"Parajuli\"," +
                        "\"receivedByPersonMIddleName\":\"T\"," +
                        "\"receivedDate\":\"2018-09-19 00:00:00.000-0400\"," +
                        "\"receiverConfirmationInd\":\"Y\"," +
                        "\"remarks\":\"test\"," +
                        "\"sentByOrgName\":\"BLT-DO\"," +
                        "\"sentByPersonId\":472629," +
                        "\"sentByPersonFirstName\":\"Tripti\"," +
                        "\"sentByPersonLastName\":\"Parajuli\"," +
                        "\"sentByPersonMiddleName\":\"T\"," +
                        "\"sentDate\":\"2018-08-03T00:00:00.000-04:00\"" +
                        "}," +
                       "{" +
                       "\"sampleTrackingNum\":852324,\"sampleTrackingSubNum\":0," +
                       "\"receivedByPersonId\":472629," +
                       "\"receivedByPersonFirstName\":\"John\"," +
                       "\"receivedByPersonLastName\":\"Somebody\"," +
                       "\"receivedByPersonMIddleName\":\"Q\"," +
                       "\"receivedDate\":\"2018-09-18 00:00:00.000-0400\"," +
                       "\"receiverConfirmationInd\":\"Y\"," +
                       "\"remarks\":\"another test\"," +
                       "\"sentByOrgName\":\"BLT-DO\"," +
                       "\"sentByPersonId\":472629," +
                       "\"sentByPersonFirstName\":\"Tripti\"," +
                       "\"sentByPersonLastName\":\"Parajuli\"," +
                       "\"sentByPersonMiddleName\":\"T\"," +
                       "\"sentDate\":\"2018-08-02T00:00:00.000-04:00\"" +
                       "}" +
                    "]",
                    SampleTransfer[].class
                );

            return completedFuture(Arrays.stream(transfers).collect(toList()));
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Async
    public CompletableFuture<MicrobiologySampleAnalysisSubmissionResponse> submitMicrobiologySampleAnalysis
        (
            MicrobiologySampleAnalysisSubmission subm
        )
    {
        return completedFuture(new MicrobiologySampleAnalysisSubmissionResponse(1234));
    }

    @Override
    @Async
    public CompletableFuture<Void> updateSampleOpStatus(long sampleOpId, String statusCode)
    {
        return completedFuture(null);
    }

}
