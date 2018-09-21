package gov.fda.nctr.arlims;

import java.util.List;

import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;


@Service
public class FactsService extends ServiceBase
{
    private FactsAccessService factsAccessService;

    public FactsService
        (
            FactsAccessService factsAccessService
        )
    {
        this.factsAccessService = factsAccessService;
    }

    public void refreshSamplesFromFacts()
    {
        List<LabInboxItem> labInboxItems = factsAccessService.getLabInboxItems();

        // TODO: Remove after testing.
        log.info(labInboxItems.toString());

        // TODO: Update tables from retrieved inbox items.

        /* [Plan]
            Make map of lab inbox items by operation id (which is "workId", according to Paul).

            Query for matching Sample records by operation id list using new SampleRepository method
                (Requires new operation id field in sample table.)

            For each matched record:
                Verify sample num/sub-num fields are the same as in the inbox record, else just log error and continue.
                Update any updatable fields that have changed.

         */
    }
}

