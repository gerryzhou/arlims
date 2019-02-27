package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.SampleOpDetails;
import gov.fda.nctr.arlims.models.dto.SampleTransfer;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.CreatedSampleAnalysisMicrobiology;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysis;


public interface FactsAccessService
{
    CompletableFuture<List<EmployeeInboxItem>> getEmployeeInboxItems(long employeeId, List<String> statusCodes);

    CompletableFuture<List<LabInboxItem>> getLabInboxItems(String orgName, List<String> statusCodes);

    CompletableFuture<SampleOpDetails> getSampleOpDetails(long sampleOpId);

    CompletableFuture<List<SampleTransfer>> getSampleTransfers(long sampleTrackingNum, Optional<Long> toPersonId);

    CompletableFuture<CreatedSampleAnalysisMicrobiology> submitMicrobiologySampleAnalysis(MicrobiologySampleAnalysis analysis);

    CompletableFuture<Void> updateWorkStatus(long sampleOpId, long personId, String statusCode);
}
