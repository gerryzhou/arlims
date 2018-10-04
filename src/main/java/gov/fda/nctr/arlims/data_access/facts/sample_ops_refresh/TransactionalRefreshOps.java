package gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import javax.transaction.Transactional;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static java.util.Collections.singletonList;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;
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
public class TransactionalRefreshOps extends ServiceBase
{
    private FactsAccessService factsAccessService;
    private SampleOpRepository sampleOpRepository;
    private SampleOpAssignmentRepository sampleOpAssignmentRepository;
    private SampleOpRefreshNoticeRepository sampleOpRefreshNoticeRepository;
    private EmployeeRepository employeeRepository;
    private LabGroupRepository labGroupRepository;
    private ObjectMapper jsonSerializer;


    public TransactionalRefreshOps
        (
            FactsAccessService factsAccessService,
            SampleOpRepository sampleOpRepository,
            SampleOpAssignmentRepository sampleOpAssignmentRepository,
            SampleOpRefreshNoticeRepository sampleOpRefreshNoticeRepository,
            EmployeeRepository employeeRepository,
            LabGroupRepository labGroupRepository
        )
    {
        this.factsAccessService = factsAccessService;
        this.sampleOpRepository = sampleOpRepository;
        this.sampleOpAssignmentRepository = sampleOpAssignmentRepository;
        this.sampleOpRefreshNoticeRepository = sampleOpRefreshNoticeRepository;
        this.employeeRepository = employeeRepository;
        this.labGroupRepository = labGroupRepository;

        this.jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonSerializer.registerModule(new JavaTimeModule());
    }

    /// Create a sample op for a group of lab inbox items having the same operation id and sample information, where
    /// each item represents an assignment of the sample work to a particular employee.
    @Transactional
    public void createSampleOp(List<LabInboxItem> inboxItemsOneOpId)
    {
        verifySingleOplId(inboxItemsOneOpId);

        log.info("Creating sample op for lab inbox items " + describeLabInboxItemGroup(inboxItemsOneOpId));

        LabGroup labGroup = getOwningLabGroup(inboxItemsOneOpId, "create-sample-op", Optional.empty());

        // All inbox items have the same op id (work id) and so should all have the same sample-op information.
        LabInboxItem leadItem = inboxItemsOneOpId.get(0);

        SampleOp sampleOp = sampleOpRepository.save(
            new SampleOp(
                leadItem.getWorkId(),
                labGroup,
                leadItem.getSampleTrackingNum(),
                leadItem.getSampleTrackingSubNum(),
                leadItem.getPacCode(),
                leadItem.getLidCode(),
                leadItem.getProblemAreaFlag(),
                leadItem.getCfsanProductDesc(),
                leadItem.getSplitInd(),
                leadItem.getStatusCode(),
                leadItem.getStatusDate(),
                Instant.now(),
                leadItem.getSamplingOrg(),
                leadItem.getSubject(),
                leadItem.getOperationCode(),
                leadItem.getSampleAnalysisId(),
                leadItem.getWorkRqstId()
            )
        );

        createSampleOpAssignments(sampleOp, inboxItemsOneOpId, "create-sample-op");

        warnIfParentOrgMismatched(sampleOp, inboxItemsOneOpId, "create-sample-op");
    }

    @Transactional
    public void updateSampleOp(SampleOp sampleOp, List<LabInboxItem> inboxItems)
    {
        verifySingleOplId(sampleOp.getWorkId(), inboxItems);

        LabInboxItem firstItem = inboxItems.get(0); // These inbox items should all have the sample work information.

        log.info("Updating sample op from lab inbox items group " + describeLabInboxItemGroup(inboxItems));

        if ( !sampleOp.getSampleTrackingNumber().equals(firstItem.getSampleTrackingNum()) ||
             !sampleOp.getSampleTrackingSubNumber().equals(firstItem.getSampleTrackingSubNum()) )
        {
            log.warn(
                "Updating sample tracking number/sub number for sample " + describeSampleOp(sampleOp) + ", which do not " +
                "match those of the lab inbox item matched by work id."
            );

            String notice = "Sample number or sub number is changing based on values in inbox items for matching op id.";
            writeSampleOpRefreshNotice(notice, "update-sample-op", Optional.of(sampleOp), inboxItems);
        }

        sampleOp.setSampleTrackingNumber(firstItem.getSampleTrackingNum());
        sampleOp.setSampleTrackingSubNumber(firstItem.getSampleTrackingSubNum());
        sampleOp.setPac(firstItem.getPacCode());
        sampleOp.setPaf(firstItem.getProblemAreaFlag());
        sampleOp.setLid(firstItem.getLidCode());
        sampleOp.setProductName(firstItem.getCfsanProductDesc());
        sampleOp.setFactsStatus(firstItem.getStatusCode());
        sampleOp.setFactsStatusTimestamp(firstItem.getStatusDate());
        sampleOp.setSamplingOrganization(firstItem.getSamplingOrg());
        sampleOp.setSubject(firstItem.getSubject());
        sampleOp.setOperationCode(firstItem.getOperationCode());
        sampleOp.setSampleAnalysisId(firstItem.getSampleAnalysisId());
        sampleOp.setWorkRequestId(firstItem.getWorkRqstId());
        sampleOp.setLastRefreshedFromFacts(Instant.now());

        LabGroup assignedEmpsLabGroup = getOwningLabGroup(inboxItems, "update-sample-op", Optional.of(sampleOp));

        if ( !assignedEmpsLabGroup.getName().equals(sampleOp.getLabGroup().getName()) )
        {
            String origLabGroupName = sampleOp.getLabGroup().getName();

            sampleOp.setLabGroup(assignedEmpsLabGroup);

            log.info(
                "The sample op being updated "  + describeSampleOp(sampleOp) + " will be moved from lab group " +
                "\"" + origLabGroupName + "\" to lab group \"" + assignedEmpsLabGroup.getName() + "\" based on the " +
                "assigned employees."
            );
        }

        SampleOp savedSampleOp = sampleOpRepository.save(sampleOp);

        updateSampleOpAssignments(savedSampleOp, inboxItems);

        warnIfParentOrgMismatched(sampleOp, inboxItems, "update-sample-op");
    }

    private void updateSampleOpAssignments(SampleOp sampleOp, List<LabInboxItem> inboxItems)
    {
        List<SampleOpAssignment> existingAssignments = sampleOpAssignmentRepository.findBySampleOpId(sampleOp.getId());

        Map<Long, LabInboxItem> unprocessedInboxItemsByPersonId =
            inboxItems.stream()
            .filter(item -> item.getAssignedToPersonId() != null)
            .collect(toMap(LabInboxItem::getAssignedToPersonId, Function.identity(), (p1,p2) -> p1)); // ignore duplicate assignments

        for ( SampleOpAssignment assignment : existingAssignments )
        {
            LabInboxItem inboxItem = unprocessedInboxItemsByPersonId.get(assignment.getEmployee().getFactsPersonId());

            if ( inboxItem != null )
            {
                assignment.setAssignedInstant(inboxItem.getAssignedToStatusDate());
                assignment.setLead(Objects.equals(inboxItem.getAssignedToLeadInd(), "Y"));

                sampleOpAssignmentRepository.save(assignment);

                unprocessedInboxItemsByPersonId.remove(inboxItem.getAssignedToPersonId());
            }
            else
            {
                sampleOpAssignmentRepository.delete(assignment);
            }
        }

        // Insert remaining unprocessed inbox items as new sample op assignments.

        createSampleOpAssignments(sampleOp, unprocessedInboxItemsByPersonId.values(), "update-sample-op");
    }

    @Transactional
    public void updateUnmatchedSampleOpStatus(SampleOp sampleOp)
    {
        log.info("Updating status for unmatched database sample op " + describeSampleOp(sampleOp));

        String statusCode = factsAccessService.getWorkStatus(sampleOp.getWorkId()).orElse("U");

        if ( statusCode.equals("U") )
            log.info(
                "Could not find status for orphaned sample op " + describeSampleOp(sampleOp) + ", " +
                "setting to inactive unknown status 'U'."
            );

        sampleOp.setFactsStatus(statusCode);

        sampleOpRepository.save(sampleOp);
    }

    private void createSampleOpAssignments
        (
            SampleOp sampleOp,
            Collection<LabInboxItem> inboxItems,
            String parentAction
        )
    {
        // Guard against duplicate assignment results in the api.
        Set<Long> prevPersonIds = new HashSet<>();

        inboxItems.forEach(inboxItem -> {

            Long assignedPersonId = inboxItem.getAssignedToPersonId();

            if ( assignedPersonId != null && prevPersonIds.add(assignedPersonId) )
            {
                Optional<Employee> maybeEmp = employeeRepository.findByFactsPersonId(assignedPersonId);

                if ( maybeEmp.isPresent() )
                {
                    boolean lead = "Y".equals(inboxItem.getAssignedToLeadInd());
                    Instant assigned = inboxItem.getAssignedToStatusDate();

                    sampleOpAssignmentRepository.save(new SampleOpAssignment(sampleOp, maybeEmp.get(), assigned, lead));
                }
                else // employee not found
                {
                    warnAssignedEmployeeNotFound(
                        parentAction + "/assignment",
                        inboxItem,
                        Optional.of(sampleOp),
                        Optional.of("Employee assignment not created.")
                    );
                }
            }
        });
    }


    /// Get the lab group owning the sample operation for the given inbox items.
    private LabGroup getOwningLabGroup
        (
            List<LabInboxItem> inboxItemsOneOpId,
            String action,
            Optional<SampleOp> sampleOp
        )
    {
        Set<Long> assignedPersonIds =
            inboxItemsOneOpId.stream()
            .filter(inboxItem -> inboxItem.getAssignedToPersonId() != null)
            .map(LabInboxItem::getAssignedToPersonId)
            .collect(toSet());

        List<LabGroup> empLabGroups = assignedPersonIds.size() > 0 ?
            labGroupRepository.findByEmployeeFactsPersonIdIn(assignedPersonIds)
            : Collections.emptyList();

        switch ( empLabGroups.size() )
        {
            case 1: return empLabGroups.get(0); // unique lab group from assigned employees
            case 0: // no recognized assigned employees
            {
                LabGroup adminLabGroup = getAdministrativeLabGroup(inboxItemsOneOpId.get(0).getAccomplishingOrg());

                log.warn(
                    "No assigned employees are recognized in lab inbox items group " +
                    describeLabInboxItemGroup(inboxItemsOneOpId) + ", these items will be assigned to the " +
                    "administrative lab group " + adminLabGroup.getName() + "."
                );

                String notice = "Could not determine lab group for inbox items group from the assigned employees, " +
                    "defaulting to administrative lab group " + adminLabGroup.getName() + ".";

                writeSampleOpRefreshNotice(notice, action, sampleOp, inboxItemsOneOpId);

                return adminLabGroup;
            }
            default: // multiple lab groups associated with assigned employees
            {
                log.warn(
                    "Multiple lab groups " + empLabGroups + " are associated with the assigned employees for inbox " +
                    "items " + describeLabInboxItemGroup(inboxItemsOneOpId) + ". The lab group " + empLabGroups.get(0) +
                    " will be assigned arbitrarily as owning lab group."
                );

                String notice = "Multiple lab groups are associated with the assigned employees for this inbox item " +
                    "group: the lab group " + empLabGroups.get(0) + " has been chosen arbitrarily from these as the " +
                    "owning lab group for this sample operation.";

                writeSampleOpRefreshNotice(notice, action, sampleOp, inboxItemsOneOpId);

                return empLabGroups.get(0);
            }
        }
    }

    private LabGroup getAdministrativeLabGroup(String parentOrg)
    {
        String name = parentOrg + "-admin";

        Optional<LabGroup> existingLabGroup = labGroupRepository.findByNameAndFactsParentOrgName(name, parentOrg);

        return existingLabGroup.orElseGet(() -> {

            log.info("Creating administrative lab group " + name + ".");

            return labGroupRepository.save(
                new LabGroup(
                    name,
                    name,
                    parentOrg,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "administrative lab group for " + parentOrg
                )
            );
        });
    }

    private void warnAssignedEmployeeNotFound
        (
            String action,
            LabInboxItem labInboxItem,
            Optional<SampleOp> maybeSample,
            Optional<String> consequencesMessage
        )
    {
        log.warn(
            "Assigned employee not found for inbox item " + describeLabInboxItemGroup(singletonList(labInboxItem)) +
            " for " + action + " operation" +
            ( maybeSample.map(sample -> " on sample " + describeSampleOp(sample)).orElse("") ) + "." +
            consequencesMessage.map(msg -> " " + msg).orElse("")
        );

        writeSampleOpRefreshNotice("assigned employee not found", action, maybeSample, singletonList(labInboxItem));
    }

    private void warnIfParentOrgMismatched(SampleOp sampleOp, List<LabInboxItem> inboxItems, String action)
    {
        // Warn if the lab group parent organization does not match that specified in the inbox items.
        if ( !sampleOp.getLabGroup().getFactsParentOrgName().equals(inboxItems.get(0).getAccomplishingOrg()) )
        {
            log.warn(
                "The sample op "  + describeSampleOp(sampleOp) + " is in lab group with parent " +
                "org \"" + sampleOp.getLabGroup().getFactsParentOrgName() + "\", which differs from the " +
                "parent org specified in the lab inbox item(s) " + describeLabInboxItemGroup(inboxItems) + "."
            );
        }

        String notice = "accomplishing org of inbox items does not match parent org of assigned employees";

        writeSampleOpRefreshNotice(notice, action, Optional.of(sampleOp), inboxItems);
    }

    private void writeSampleOpRefreshNotice
        (
            String notice,
            String action,
            Optional<SampleOp> maybeSample,
            List<LabInboxItem> labInboxItems
        )
    {
        sampleOpRefreshNoticeRepository.save(
            new SampleOpRefreshNotice(
                Instant.now(),
                action,
                notice,
                maybeSample.map(sample -> sample.getLabGroup().getFactsParentOrgName()).orElse(null),
                labInboxItems.get(0).getAccomplishingOrg(),
                maybeSample.map(sample -> toJsonString(jsonSerializer, new ReportingSampleOp(sample))).orElse(null),
                toJsonString(jsonSerializer, labInboxItems)
            )
        );
    }


    private void verifySingleOplId(List<LabInboxItem> opLabInboxItems)
    {
        if ( opLabInboxItems.stream().map(LabInboxItem::getWorkId).distinct().count() > 1 )
            throw new RuntimeException("expected inbox items to all have the same op id");
    }

    private void verifySingleOplId(long opId, List<LabInboxItem> opLabInboxItems)
    {
        if ( opLabInboxItems.stream().anyMatch(item -> item.getWorkId() != opId ) )
            throw new RuntimeException("expected inbox items to all have expected op id " + opId);
    }

}

