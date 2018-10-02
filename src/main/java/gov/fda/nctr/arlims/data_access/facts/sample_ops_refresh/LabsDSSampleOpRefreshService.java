package gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import static java.util.stream.Collectors.*;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.raw.jpa.*;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.*;
import static gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh.ReportingUtils.describeLabInboxItemGroup;
import static gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh.ReportingUtils.describeSampleOp;
import static gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh.ReportingUtils.toJsonString;


@Service
public class LabsDSSampleOpRefreshService extends ServiceBase implements SampleOpRefreshService
{
    private TransactionalRefreshOps transactionalOps;
    private FactsAccessService factsAccessService;
    private SampleOpRepository sampleOpRepository;
    private SampleOpRefreshNoticeRepository sampleOpRefreshNoticeRepository;
    private ObjectMapper jsonSerializer;

    private static final List<String> REFRESHABLE_SAMPLE_OP_STATUS_CODES = Arrays.asList("S", "I", "O");


    public LabsDSSampleOpRefreshService
        (
            TransactionalRefreshOps transactionalRefreshOps,
            FactsAccessService factsAccessService,
            SampleOpRepository sampleOpRepository,
            SampleOpRefreshNoticeRepository sampleOpRefreshNoticeRepository
        )
    {
        this.transactionalOps = transactionalRefreshOps;
        this.factsAccessService = factsAccessService;
        this.sampleOpRepository = sampleOpRepository;
        this.sampleOpRefreshNoticeRepository = sampleOpRefreshNoticeRepository;

        this.jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonSerializer.registerModule(new JavaTimeModule());
    }

    public void refreshSampleOpsFromFacts()
    {
        List<LabInboxItem> labInboxItems = factsAccessService.getLabInboxItems(REFRESHABLE_SAMPLE_OP_STATUS_CODES);

        log.info("Refreshing samples and employee assignments from " + labInboxItems.size() + " FACTS lab inbox items.");

        Map<Long, List<LabInboxItem>> labInboxItemsByOpId =
            labInboxItems.stream()
            .filter(item -> item.getSampleTrackingNum() != null)
            .collect(groupingBy(LabInboxItem::getWorkId)); // collect work assignments to multiple employees by op id

        Map<Long, SampleOp> matchedSampleOpsByOpId =
            sampleOpRepository.findByWorkIdIn(labInboxItemsByOpId.keySet()).stream()
            .collect(toMap(SampleOp::getWorkId, Function.identity()));

        List<SampleOp> unmatchedActiveSampleOps =
            sampleOpRepository.findByFactsStatusIn(REFRESHABLE_SAMPLE_OP_STATUS_CODES).stream()
            .filter(sample -> !matchedSampleOpsByOpId.containsKey(sample.getWorkId()))
            .collect(toList());


        // Create new samples for inbox items that have no matching sample by op id.

        List<List<LabInboxItem>> unmatchedInboxItemsPartitionedByOpId =
            labInboxItemsByOpId.values().stream()
            .filter(items -> !matchedSampleOpsByOpId.containsKey(items.get(0).getWorkId()))
            .collect(toList());

        SuccessFailCounts createCounts = createSampleOpsForInboxItems(unmatchedInboxItemsPartitionedByOpId);


        // Update sample ops which are matched to inbox items by op id.

        SuccessFailCounts updateCounts = updateSampleOpsForInboxItems(matchedSampleOpsByOpId.values(), labInboxItemsByOpId);


        // Update statuses for active sample ops that don't have a matching inbox item by op id.

        SuccessFailCounts unmatchedSampleOpStatusUpdateCounts = updateUnmatchedSampleOpStatuses(unmatchedActiveSampleOps);


        log.info("Completed refresh of sample operations from FACTS lab inbox: " +
            createCounts.succeeded + " samples created, " +
            (createCounts.failed> 0 ? createCounts.failed + " samples failed to be created," : "" ) +
            updateCounts.succeeded + " samples updated, " +
            (updateCounts.failed > 0 ? updateCounts.failed + " failed to be updated," : "" ) +
            unmatchedSampleOpStatusUpdateCounts.succeeded + " unmatched sample statuses updated" +
            (unmatchedSampleOpStatusUpdateCounts.failed > 0 ?
                ", " + unmatchedSampleOpStatusUpdateCounts.failed   + " unmatched sample statuses failed to be updated."
                : "." )
        );
    }

    /// Create samples for groups of lab inbox items, where each group's members have the same operation id and each
    /// member represents an assignment of the sample work to a particular employee.
    private SuccessFailCounts createSampleOpsForInboxItems(List<List<LabInboxItem>> inboxItemsPartionedByOpId)
    {
        int succeeded = 0, failed = 0;

        for ( List<LabInboxItem> inboxItemsOneOpId : inboxItemsPartionedByOpId )
        {
            try
            {
                transactionalOps.createSampleOp(inboxItemsOneOpId);

                ++succeeded;
            }
            catch(Exception e)
            {
                log.warn(
                    "Failed to create sample op for lab inbox items " + describeLabInboxItemGroup(inboxItemsOneOpId) +
                    ": " + e.getMessage()
                );

                sampleOpRefreshNoticeRepository.save(
                    new SampleOpRefreshNotice(
                        Instant.now(),
                        "create-sample-op",
                        e.getMessage(),
                        null,
                        inboxItemsOneOpId.get(0).getAccomplishingOrg(),
                        null,
                        toJsonString(jsonSerializer, inboxItemsOneOpId)
                    )
                );

                ++failed;
            }
        }

        return new SuccessFailCounts(succeeded, failed);
    }

    private SuccessFailCounts updateSampleOpsForInboxItems
        (
            Collection<SampleOp> sampleOps,
            Map<Long, List<LabInboxItem>> labInboxItemsByOpId
        )
    {
        int succeeded = 0, failed = 0;

        for ( SampleOp sampleOp : sampleOps)
        {
            List<LabInboxItem> inboxItems = labInboxItemsByOpId.get(sampleOp.getWorkId());

            try
            {
                transactionalOps.updateSampleOp(sampleOp, inboxItems);

                ++succeeded;
            }
            catch(Exception e)
            {
                log.warn(
                    "Failed to update sample op " + describeSampleOp(sampleOp) + " for lab inbox items group "
                    + describeLabInboxItemGroup(inboxItems) + ": " + e.getMessage()
                );

                sampleOpRefreshNoticeRepository.save(
                    new SampleOpRefreshNotice(
                        Instant.now(),
                        "update-sample-op",
                        e.getMessage(),
                        sampleOp.getLabGroup().getFactsParentOrgName(),
                        inboxItems.get(0).getAccomplishingOrg(),
                        toJsonString(jsonSerializer, new ReportingSampleOp(sampleOp)),
                        toJsonString(jsonSerializer, inboxItems)
                    )
                );

                ++failed;
            }
        }

        return new SuccessFailCounts(succeeded, failed);
    }

    private SuccessFailCounts updateUnmatchedSampleOpStatuses(List<SampleOp> sampleOps)
    {
        int succeeded = 0, failed = 0;

        for ( SampleOp sampleOp : sampleOps)
        {
            try
            {
                transactionalOps.updateUnmatchedSampleOpStatus(sampleOp);

                ++succeeded;
            }
            catch(Exception e)
            {
                log.warn("Failed to update status for sample op " + sampleOp + ": " + e.getMessage());

                sampleOpRefreshNoticeRepository.save(
                    new SampleOpRefreshNotice(
                        Instant.now(),
                        "update-unmatched-sample-op-status",
                        e.getMessage(),
                        sampleOp.getLabGroup().getFactsParentOrgName(),
                        null,
                        toJsonString(jsonSerializer, new ReportingSampleOp(sampleOp)),
                        null
                    )
                );

                ++failed;
            }
        }

        return new SuccessFailCounts(succeeded, failed);
    }
}


class SuccessFailCounts
{
    int succeeded;
    int failed;

    SuccessFailCounts(int succeeded, int failed)
    {
        this.succeeded = succeeded;
        this.failed = failed;
    }
}

@JsonAutoDetect(
    fieldVisibility = JsonAutoDetect.Visibility.ANY,
    getterVisibility = JsonAutoDetect.Visibility.NONE,
    setterVisibility = JsonAutoDetect.Visibility.NONE
)
class ReportingSampleOp
{
    private Long id;

    private Long workId;

    private Long labGroupId;

    private String labGroupName;
    private String labGroupFactsOrg;
    private String labGroupFactsParentOrg;

    private Long sampleTrackingNum;

    private Long sampleTrackingSubNum;

    private String pac;

    private String lid;

    private String paf;

    private String productName;

    private String splitInd;

    private String factsStatus;

    private Instant factsStatusTimestamp;

    private Instant lastRefreshedFromFacts;

    private String samplingOrganization;

    private String subject;

    private String operationCode;

    private Long sampleAnalysisId;

    private Long workRequestId;

    ReportingSampleOp(SampleOp sampleOp)
    {
        this.id = sampleOp.getId();
        this.workId = sampleOp.getWorkId();
        this.labGroupId = sampleOp.getLabGroupId();
        this.labGroupName = sampleOp.getLabGroup().getName();
        this.labGroupFactsOrg = sampleOp.getLabGroup().getFactsOrgName();
        this.labGroupFactsParentOrg = sampleOp.getLabGroup().getFactsParentOrgName();
        this.sampleTrackingNum = sampleOp.getSampleTrackingNumber();
        this.sampleTrackingSubNum = sampleOp.getSampleTrackingSubNumber();
        this.pac = sampleOp.getPac();
        this.lid = sampleOp.getLid();
        this.paf = sampleOp.getPaf();
        this.productName = sampleOp.getProductName();
        this.splitInd = sampleOp.getSplitInd();
        this.factsStatus = sampleOp.getFactsStatus();
        this.factsStatusTimestamp = sampleOp.getFactsStatusTimestamp();
        this.lastRefreshedFromFacts = sampleOp.getLastRefreshedFromFacts();
        this.samplingOrganization = sampleOp.getSamplingOrganization();
        this.subject = sampleOp.getSubject();
        this.operationCode = sampleOp.getOperationCode();
        this.sampleAnalysisId = sampleOp.getSampleAnalysisId();
        this.workRequestId = sampleOp.getWorkRequestId();
    }
}