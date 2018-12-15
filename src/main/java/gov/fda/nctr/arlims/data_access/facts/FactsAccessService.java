package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;
import java.util.Optional;

import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmission;
import gov.fda.nctr.arlims.models.dto.facts.microbiology.MicrobiologySampleAnalysisSubmissionResponse;


public interface FactsAccessService
{
    List<LabInboxItem> getLabInboxItems(List<String> statusCodes, Optional<String> accomplishingOrg);

    Optional<String> getWorkStatus(long workId);

    MicrobiologySampleAnalysisSubmissionResponse submitMicrobiologySampleAnalysis(MicrobiologySampleAnalysisSubmission subm);
}
