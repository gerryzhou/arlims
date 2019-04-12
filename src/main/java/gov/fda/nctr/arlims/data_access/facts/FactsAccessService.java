package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.models.dto.SampleOpTimeCharges;
import gov.fda.nctr.arlims.models.dto.SampleTransfer;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.CreatedSampleAnalysisMicrobiology;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysis;


public interface FactsAccessService
{
    CompletableFuture<List<EmployeeInboxItem>> getPersonInboxItems(long personId, Optional<List<String>> statusCodes);

    CompletableFuture<List<LabInboxItem>> getLabInboxItems(String orgName, Optional<List<String>> statusCodes);

    CompletableFuture<List<SampleTransfer>> getSampleTransfers(long sampleTrackingNumber, Optional<Long> toPersonId);

    CompletableFuture<List<CreatedSampleAnalysisMicrobiology>> submitMicrobiologySampleAnalyses(List<MicrobiologySampleAnalysis> analyses);

    CompletableFuture<Void> updateWorkStatus(long sampleOpId, long personId, String statusCode);

    CompletableFuture<Void> submitSampleOpTimeCharges(SampleOpTimeCharges timeCharges);
}
