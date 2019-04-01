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

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.SampleOpDetails;
import gov.fda.nctr.arlims.models.dto.SampleOpTimeCharges;
import gov.fda.nctr.arlims.models.dto.SampleTransfer;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.CreatedSampleAnalysisMicrobiology;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysis;


@Service
@Profile({"fake-labsds"})
public class FakeFactsAccessService extends ServiceBase implements FactsAccessService
{
    private final ObjectMapper jsonObjectMapper;


    FakeFactsAccessService()
    {
        this.jsonObjectMapper = Jackson2ObjectMapperBuilder.json().build();

        log.info("Initializing fake LABS-DS access service.");
    }

    @Override
    @Async
    public CompletableFuture<List<EmployeeInboxItem>> getPersonInboxItems(long personId, Optional<List<String>> statusCodes)
    {
        try
        {
            List<EmployeeInboxItem> items = Arrays.asList(jsonObjectMapper.readValue(
                "[" +
                "{" +
                "\"sampleTrackingNumber\":853317," +
                "\"leadIndicator\":\"Y\"," +
                "\"personId\":472629," +
                "\"sampleAnalysisId\":885106," +
                "\"sampleTrackingSubNumber\":0," +
                "\"statusCode\":\"I\"," +
                "\"statusDate\":\"2019-02-14 12:05:22.000-0500\"," +
                "\"subjectText\":\"Adhoc Sample Analysis\"," +
                "\"operationId\":8646420," +
                "\"firstName\":\"Stephen\"," +
                "\"lastName\":\"Harris\"," +
                "\"mdlIntlName\":\"C\"," +
                "\"pacCode\":\"71003E\"," +
                "\"pacCodeDescription\":\"MICROBIAL AGENTS\"," +
                "\"cfsanPrductDescription\":\"Micro Product\"," +
                "\"problemAreaFlag\":\"MIC\"," +
                "\"lidCode\":\"M\"" +
                "}," +
                "{" +
                "\"sampleTrackingNumber\":852325," +
                "\"personId\":472629," +
                "\"remarksText\":\"Starting work on this sample\"," +
                "\"sampleAnalysisId\":881828," +
                "\"sampleTrackingSubNumber\":0," +
                "\"statusCode\":\"I\"," +
                "\"statusDate\":\"2019-01-07 13:47:06.000-0500\"," +
                "\"operationId\":8643036," +
                "\"firstName\":\"Tripti\"," +
                "\"lastName\":\"Parajuli\"," +
                "\"mdlIntlName\":\"T\"," +
                "\"pacCode\":\"03844\"," +
                "\"pacCodeDescription\":\"IMPORTED SEAFOOD PRODUCTS\"," +
                "\"cfsanPrductDescription\":\"FROZEN RAW SHELL ON SHRIMP 16/20\"," +
                "\"problemAreaFlag\":\"MIC\"," +
                "\"lidCode\":\"M\"" +
                "}," +
                "{" +
                "\"sampleTrackingNumber\":852301," +
                "\"personId\":472629," +
                "\"remarksText\":\"Please work on this sample\"," +
                "\"sampleAnalysisId\":881427," +
                "\"sampleTrackingSubNumber\":0," +
                "\"statusCode\":\"O\"," +
                "\"statusDate\":\"2019-01-07 13:47:06.000-0500\"," +
                "\"operationId\":8623636," +
                "\"firstName\":\"Tripti\"," +
                "\"lastName\":\"Parajuli\"," +
                "\"mdlIntlName\":\"T\"," +
                "\"pacCode\":\"03844\"," +
                "\"pacCodeDescription\":\"IMPORTED SEAFOOD PRODUCTS\"," +
                "\"cfsanPrductDescription\":\"FROZEN SCALLOPS 10/15\"," +
                "\"problemAreaFlag\":\"MIC\"," +
                "\"lidCode\":\"M\"" +
                "}" +
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
    public CompletableFuture<List<LabInboxItem>> getLabInboxItems(String orgName, Optional<List<String>> statusCodes)
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
                "\"sampleTrackingNumber\": 804972,\n" +
                "\"sampleTrackingSubNumber\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"I\",\n" +
                "\"statusDate\": \"2018-04-17 11:08:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"operationId\": 6687466,\n" +
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
                "\"sampleTrackingNumber\": 804971,\n" +
                "\"sampleTrackingSubNumber\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"I\",\n" +
                "\"statusDate\": \"2018-03-16 11:08:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"operationId\": 6587465,\n" +
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
                "\"sampleTrackingNumber\": 804971,\n" +
                "\"sampleTrackingSubNumber\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"I\",\n" +
                "\"statusDate\": \"2018-03-16 11:08:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"operationId\": 6587465,\n" +
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
                "\"sampleTrackingNumber\": 803970,\n" +
                "\"sampleTrackingSubNumber\": 0,\n" +
                "\"samplingDistrictOrgId\": 20,\n" +
                "\"samplingOrg\": \"NYK-DO\",\n" +
                "\"statusCode\": \"P\",\n" +
                "\"statusDate\": \"2018-03-15 10:07:59.000-0400\",\n" +
                "\"subject\": null,\n" +
                "\"operationId\": 6487464,\n" +
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
                "{" +
                "\"operationId\": 123456," +
                "\"sampleTrackingNumber\": 804972," +
                "\"sampleTrackingSubNumber\": 0," +
                "\"programAssignmentCode\": \"04019A\"," +
                "\"cfsanProductDesc\": \"SMOKED TROUT\"" +
                "}",
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
    public CompletableFuture<List<SampleTransfer>> getSampleTransfers(long sampleTrackingNumber, Optional<Long> toPersonId)
    {
        try
        {
            SampleTransfer[] transfers =
                jsonObjectMapper.readValue(
                    "[" +
                    "{" +
                    "\"sampleTrackingNumber\":852325," +
                    "\"sampleTrackingSubNumber\":0," +
                    "\"receivedByPersonId\":472629," +
                    "\"receivedByPersonFirstName\":\"Stephen\"," +
                    "\"receivedByPersonLastName\":\"Harris\"," +
                    "\"receivedDate\":\"2019-02-19\"," +
                    "\"receiverConfirmationInd\":\"Y\"," +
                    "\"sentByPersonId\":472629," +
                    "\"sentByPersonFirstName\":\"Tripti\"," +
                    "\"sentByPersonLastName\":\"Parajuli\"," +
                    "\"sentDate\":\"2019-02-05\"," +
                    "\"sentByOrgName\":\"BLT-DO\"," +
                    "\"remarks\":\"test\"" +
                    "}," +
                    "{" +
                    "\"sampleTrackingNumber\":853603," +
                    "\"sampleTrackingSubNumber\":0," +
                    "\"receivedByPersonId\":472629," +
                    "\"receivedByPersonFirstName\":\"Stephen\"," +
                    "\"receivedByPersonLastName\":\"Harris\"," +
                    "\"receivedDate\":\"2019-02-18\"," +
                    "\"receiverConfirmationInd\":\"Y\"," +
                    "\"sentByPersonId\":472629," +
                    "\"sentByPersonFirstName\":\"Tripti\"," +
                    "\"sentByPersonLastName\":\"Parajuli\"," +
                    "\"sentDate\":\"2019-02-03\"," +
                    "\"sentByOrgName\":\"BLT-DO\"," +
                    "\"remarks\":\"test\"" +
                    "}," +
                    "{" +
                    "\"sampleTrackingNumber\":852285," +
                    "\"sampleTrackingSubNumber\":0," +
                    "\"receivedByPersonId\":123456," +
                    "\"receivedByPersonFirstName\":\"Sam\"," +
                    "\"receivedByPersonLastName\":\"Wise\"," +
                    "\"receivedDate\":\"2019-01-29\"," +
                    "\"receiverConfirmationInd\":\"Y\"," +
                    "\"sentByPersonId\":472628," +
                    "\"sentByPersonFirstName\":\"Les\"," +
                    "\"sentByPersonLastName\":\"Paul\"," +
                    "\"sentDate\":\"2019-02-05\"," +
                    "\"sentByOrgName\":\"BLT-DO\"," +
                    "\"remarks\":\"test\"" +
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
    public CompletableFuture<CreatedSampleAnalysisMicrobiology> submitMicrobiologySampleAnalysis
        (
            MicrobiologySampleAnalysis subm
        )
    {
        log.info("Received submission in fake FACTS access service: " + toJson(subm));

        return completedFuture(new CreatedSampleAnalysisMicrobiology(12345L));
    }

    @Override
    @Async
    public CompletableFuture<Void> updateWorkStatus(long sampleOpId, long personId, String statusCode)
    {
        log.info(
            "Received request to update work status in fake FACTS access service for op = " + sampleOpId +
            ", personId = " + personId + ", statusCode = " + statusCode
        );

        return completedFuture(null);
    }


    @Override
    @Async
    public CompletableFuture<Void> submitSampleOpTimeCharges(SampleOpTimeCharges timeCharges)
    {
        log.info("Received request to submit sample op time charges.");

        return completedFuture(null);
    }

    private String toJson(Object o)
    {
        try
        {
            return jsonObjectMapper.writeValueAsString(o);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

}
