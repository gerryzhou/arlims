package gov.fda.nctr.arlims.data_access.facts;

import java.util.List;

import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.raw.jpa.SampleRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample;
import static java.util.stream.Collectors.toList;


@Service
public class LabsDSSampleRefreshService extends ServiceBase implements SampleRefreshService
{
    private FactsAccessService factsAccessService;
    private SampleRepository sampleRepository;

    public LabsDSSampleRefreshService
        (
            FactsAccessService factsAccessService,
            SampleRepository sampleRepository
        )
    {
        this.factsAccessService = factsAccessService;
        this.sampleRepository = sampleRepository;
    }

    public void refreshSamplesFromFacts()
    {
        List<LabInboxItem> labInboxItems = factsAccessService.getLabInboxItems();

        List<Long> inboxOpIds = labInboxItems.stream().map(LabInboxItem::getWorkId).collect(toList());

        // TODO: Remove after testing.
        log.info(labInboxItems.toString());

        List<Sample> samples = sampleRepository.findByWorkIdIn(inboxOpIds);

        // TODO: Update tables from retrieved inbox items.

        /* [Plan]
            Make map of lab inbox items by operation id (which is "workId", according to Paul).

            Query for matching Sample records by operation id list using new SampleRepository method

            For each matched record:
                Verify sample num/sub-num fields are the same as in the inbox record, else just log error and continue.
                Update any updatable fields that have changed.

            Insert new db records for unmatched inbox items.

            Mark disabled/finished any unmatched records on db side.
         */
    }
}

