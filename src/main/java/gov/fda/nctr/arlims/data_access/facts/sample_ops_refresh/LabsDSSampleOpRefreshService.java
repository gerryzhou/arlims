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
import gov.fda.nctr.arlims.models.dto.sample_ops_refresh.SampleOpFailure;
import gov.fda.nctr.arlims.models.dto.sample_ops_refresh.SampleOpIdent;
import gov.fda.nctr.arlims.models.dto.sample_ops_refresh.SampleOpsRefreshResults;
import gov.fda.nctr.arlims.models.dto.sample_ops_refresh.SampleOpsResults;
import static gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh.ReportingUtils.*;


@Service
public class LabsDSSampleOpRefreshService extends ServiceBase implements SampleOpRefreshService
{
    private TransactionalRefreshOps transactionalOps;
    private FactsAccessService factsAccessService;
    private SampleOpRepository sampleOpRepository;
    private SampleOpRefreshNoticeRepository sampleOpRefreshNoticeRepository;
    private ObjectMapper jsonSerializer;

    private static final List<String> REFRESHABLE_SAMPLE_OP_STATUSES = Arrays.asList("S", "I", "O");


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

    @Override
    public synchronized void refreshSampleOpsFromFacts()
    {
        List<LabInboxItem> labInboxItems;
        try
        {
            labInboxItems = factsAccessService.getLabInboxItems(REFRESHABLE_SAMPLE_OP_STATUSES, Optional.empty());
        }
        catch(Throwable t)
        {
            warnFetchOfLabInboxItemsFailed(t);
            throw t;
        }

        log.info("Refreshing samples and employee assignments from " + labInboxItems.size() + " FACTS lab inbox items.");

        Map<Long,List<LabInboxItem>> labInboxItemsByOpId =
            labInboxItems.stream()
            .filter(item -> item.getSampleTrackingNum() != null)
            .collect(groupingBy(LabInboxItem::getWorkId)); // collect work assignments to multiple employees by op id

        Map<Long,SampleOp> matchedSampleOpsByOpId;
        List<SampleOp> unmatchedActiveSampleOps;
        try
        {
            matchedSampleOpsByOpId =
                sampleOpRepository.findByWorkIdIn(labInboxItemsByOpId.keySet()).stream()
                .collect(toMap(SampleOp::getWorkId, Function.identity()));

            unmatchedActiveSampleOps =
                sampleOpRepository.findByFactsStatusIn(REFRESHABLE_SAMPLE_OP_STATUSES).stream()
                .filter(sample -> !matchedSampleOpsByOpId.containsKey(sample.getWorkId()))
                .collect(toList());
        }
        catch(Throwable t)
        {
            warnFetchOfRefreshableSamplesFailed(t);
            throw t;
        }

        // Create new samples for inbox items that have no matching sample by op id.

        List<List<LabInboxItem>> unmatchedInboxItemsPartitionedByOpId =
            labInboxItemsByOpId.values().stream()
            .filter(items -> !matchedSampleOpsByOpId.containsKey(items.get(0).getWorkId()))
            .collect(toList());

        SampleOpsResults createResults =
            createSampleOpsForInboxItems(unmatchedInboxItemsPartitionedByOpId, true);

        // Update sample ops which are matched to inbox items by op id.

        SampleOpsResults updateResults =
            updateSampleOpsForInboxItems(matchedSampleOpsByOpId.values(), labInboxItemsByOpId, true);

        // Update statuses for active sample ops that don't have a matching inbox item by op id.

        SampleOpsResults unmatchedSampleOpStatusUpdateCounts =
            updateUnmatchedSampleOpStatuses(unmatchedActiveSampleOps, true);

        log.info("Completed refresh of sample operations from FACTS lab inbox: " +
            createResults.getSucceededSampleOps().size() + " samples created, " +
            (createResults.getFailedSampleOps().size() > 0 ?
                createResults.getFailedSampleOps().size() + " samples failed to be created," : "" ) +
            updateResults.getSucceededSampleOps().size() + " samples updated, " +
            (updateResults.getFailedSampleOps().size() > 0 ?
                updateResults.getFailedSampleOps().size() + " failed to be updated," : "" ) +
            unmatchedSampleOpStatusUpdateCounts.getSucceededSampleOps().size() +
                " unmatched sample statuses updated" +
            (unmatchedSampleOpStatusUpdateCounts.getFailedSampleOps().size() > 0 ?
                ", " + unmatchedSampleOpStatusUpdateCounts.getFailedSampleOps().size() +
                " unmatched sample statuses failed to be updated."
                : "." )
        );
    }

    @Override
    public synchronized SampleOpsRefreshResults refreshOrganizationSampleOpsFromFacts(String accomplishingOrg)
    {
        List<LabInboxItem> labInboxItems =
            factsAccessService.getLabInboxItems(REFRESHABLE_SAMPLE_OP_STATUSES, Optional.of(accomplishingOrg));

        Map<Long,List<LabInboxItem>> labInboxItemsByOpId =
            labInboxItems.stream()
            .filter(item -> item.getSampleTrackingNum() != null)
            .collect(groupingBy(LabInboxItem::getWorkId)); // collect work assignments to multiple employees by op id

        Map<Long,SampleOp> matchedSampleOpsByOpId =
            sampleOpRepository.findByWorkIdIn(labInboxItemsByOpId.keySet()).stream()
            .collect(toMap(SampleOp::getWorkId, Function.identity()));

        List<SampleOp> unmatchedActiveSampleOps =
            sampleOpRepository.findByParentOrgAndFactsStatusIn(accomplishingOrg, REFRESHABLE_SAMPLE_OP_STATUSES).stream()
            .filter(sample -> !matchedSampleOpsByOpId.containsKey(sample.getWorkId()))
            .collect(toList());

        // Create new samples for inbox items that have no matching sample by op id.

        List<List<LabInboxItem>> unmatchedInboxItemsPartitionedByOpId =
            labInboxItemsByOpId.values().stream()
            .filter(items -> !matchedSampleOpsByOpId.containsKey(items.get(0).getWorkId()))
            .collect(toList());

        SampleOpsResults createResults =
            createSampleOpsForInboxItems(unmatchedInboxItemsPartitionedByOpId, false);

        // Update sample ops which are matched to inbox items by op id.

        SampleOpsResults updateResults =
            updateSampleOpsForInboxItems(matchedSampleOpsByOpId.values(), labInboxItemsByOpId, false);

        // Update statuses for active sample ops that don't have a matching inbox item by op id.

        SampleOpsResults unmatchedSampleOpStatusUpdateResults =
            updateUnmatchedSampleOpStatuses(unmatchedActiveSampleOps, false);

        return new SampleOpsRefreshResults(createResults, updateResults, unmatchedSampleOpStatusUpdateResults);
    }

    /// Create samples for groups of lab inbox items, where each group's members have the same operation id and each
    /// member represents an assignment of the sample work to a particular employee.
    private SampleOpsResults createSampleOpsForInboxItems
        (
            List<List<LabInboxItem>> inboxItemsPartionedByOpId,
            boolean writeFailureNotices
        )
    {
        List<SampleOpIdent> succeeded = new ArrayList<>();
        List<SampleOpFailure> failed = new ArrayList<>();

        for ( List<LabInboxItem> inboxItemsOneOpId : inboxItemsPartionedByOpId )
        {
            SampleOpIdent sampleOpIdent = getSampleOpIdent(inboxItemsOneOpId);

            try
            {
                transactionalOps.createSampleOp(inboxItemsOneOpId);

                succeeded.add(sampleOpIdent);
            }
            catch(Exception e)
            {
                String errorMsg = describeError(e);

                failed.add(new SampleOpFailure(sampleOpIdent, errorMsg));

                log.warn(
                    "Failed to create sample op for lab inbox items " + describeLabInboxItemGroup(inboxItemsOneOpId) +
                    ": " + errorMsg
                );

                if ( writeFailureNotices )
                {
                    sampleOpRefreshNoticeRepository.save(
                        new SampleOpRefreshNotice(
                            Instant.now(),
                            "create-sample-op",
                            describeError(e),
                            null,
                            inboxItemsOneOpId.get(0).getAccomplishingOrg(),
                            null,
                            toJsonString(jsonSerializer, inboxItemsOneOpId)
                        )
                    );
                }
            }
        }

        return new SampleOpsResults(succeeded, failed);
    }

    private SampleOpsResults updateSampleOpsForInboxItems
        (
            Collection<SampleOp> sampleOps,
            Map<Long, List<LabInboxItem>> labInboxItemsByOpId,
            boolean writeFailureNotices
        )
    {
        List<SampleOpIdent> succeeded = new ArrayList<>();
        List<SampleOpFailure> failed = new ArrayList<>();

        for ( SampleOp sampleOp : sampleOps)
        {
            List<LabInboxItem> inboxItemsOneOpId = labInboxItemsByOpId.get(sampleOp.getWorkId());

            SampleOpIdent sampleOpIdent = getSampleOpIdent(inboxItemsOneOpId);

            try
            {
                transactionalOps.updateSampleOp(sampleOp, inboxItemsOneOpId);

                succeeded.add(sampleOpIdent);
            }
            catch(Exception e)
            {
                String errorMsg = describeError(e);

                failed.add(new SampleOpFailure(sampleOpIdent, errorMsg));

                log.warn(
                    "Failed to update sample op " + describeSampleOp(sampleOp) + " for lab inbox items group "
                    + describeLabInboxItemGroup(inboxItemsOneOpId) + ": " + errorMsg
                );

                if ( writeFailureNotices )
                {
                    sampleOpRefreshNoticeRepository.save(
                        new SampleOpRefreshNotice(
                            Instant.now(),
                            "update-sample-op",
                            describeError(e),
                            sampleOp.getLabGroup().getFactsParentOrgName(),
                            inboxItemsOneOpId.get(0).getAccomplishingOrg(),
                            toJsonString(jsonSerializer, new ReportingSampleOp(sampleOp)),
                            toJsonString(jsonSerializer, inboxItemsOneOpId)
                        )
                    );
                }
            }
        }

        return new SampleOpsResults(succeeded, failed);
    }

    private SampleOpsResults updateUnmatchedSampleOpStatuses
        (
            List<SampleOp> sampleOps,
            boolean writeFailureNotices
        )
    {
        List<SampleOpIdent> succeeded = new ArrayList<>();
        List<SampleOpFailure> failed = new ArrayList<>();

        for ( SampleOp so : sampleOps )
        {
            SampleOpIdent sampleOpIdent = new SampleOpIdent(so.getSampleTrackingNumber(), so.getSampleTrackingSubNumber(), so.getWorkId());

            try
            {
                transactionalOps.updateUnmatchedSampleOpStatus(so);

                succeeded.add(sampleOpIdent);
            }
            catch(Exception e)
            {
                String errorMsg = describeError(e);

                failed.add(new SampleOpFailure(sampleOpIdent, errorMsg));

                log.warn("Failed to update status for sample op " + so + ": " + errorMsg);

                if ( writeFailureNotices )
                {
                    sampleOpRefreshNoticeRepository.save(
                        new SampleOpRefreshNotice(
                            Instant.now(),
                            "update-unmatched-sample-op-status",
                            describeError(e),
                            so.getLabGroup().getFactsParentOrgName(),
                            null,
                            toJsonString(jsonSerializer, new ReportingSampleOp(so)),
                            null
                        )
                    );
                }
            }
        }

        return new SampleOpsResults(succeeded, failed);
    }

    private SampleOpIdent getSampleOpIdent(List<LabInboxItem> inboxItemsOneOpId)
    {
        LabInboxItem leadItem = inboxItemsOneOpId.get(0);

        return new SampleOpIdent(
            leadItem.getSampleTrackingNum(),
            leadItem.getSampleTrackingSubNum(),
            leadItem.getWorkId()
        );
    }

    private void warnFetchOfRefreshableSamplesFailed(Throwable t)
    {
        log.warn("Failed to load refreshable samples from database due to error: " + describeError(t));

        transactionalOps.writeSampleOpRefreshNotice(
            "Could not load refreshable samples from database: " + describeError(t),
            "refresh-sample-ops-from-labs-inbox",
            Optional.empty(),
            Collections.emptyList()
        );
    }

    private void warnFetchOfLabInboxItemsFailed(Throwable t)
    {
        log.warn("Failed to fetch lab inbox items due to error: " + describeError(t));

        transactionalOps.writeSampleOpRefreshNotice(
            "Could not fetch lab inbox item from LABS-DS api: " + describeError(t),
            "refresh-sample-ops-from-labs-inbox",
            Optional.empty(),
            Collections.emptyList()
        );
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