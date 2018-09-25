package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;
import java.util.Optional;

import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;


public interface FactsAccessService
{
    List<LabInboxItem> getLabInboxItems(List<String> statusCodes);

    Optional<String> getWorkStatus(long workId);
}
