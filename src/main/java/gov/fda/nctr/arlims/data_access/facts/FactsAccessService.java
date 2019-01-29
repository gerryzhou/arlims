package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.SampleOpDetails;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmission;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmissionResponse;


public interface FactsAccessService
{
    CompletableFuture<List<EmployeeInboxItem>> getEmployeeInboxItems(long employeeId, List<String> statusCodes);

    CompletableFuture<List<LabInboxItem>> getLabInboxItems(String orgName, List<String> statusCodes);

    CompletableFuture<SampleOpDetails> getSampleOpDetails(long sampleOpId);

    CompletableFuture<MicrobiologySampleAnalysisSubmissionResponse> submitMicrobiologySampleAnalysis(MicrobiologySampleAnalysisSubmission subm);

    CompletableFuture<Void> updateSampleOpStatus(long sampleOpId, String statusCode);
}
