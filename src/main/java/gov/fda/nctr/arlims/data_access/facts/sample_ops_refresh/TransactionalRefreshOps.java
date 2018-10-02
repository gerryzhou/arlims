package gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import javax.transaction.Transactional;
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
import static java.util.stream.Collectors.toMap;


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

        log.info("Creating sample op for lab inbox items group " + describeLabInboxItemGroup(inboxItemsOneOpId));

        // The lab group is determined by the first encountered lead employee assignment if any, else just the first
        // assigned employee. Other, sample and work related attributes should be the same for all of the items because
        // they shared the same op id.
        LabInboxItem leadLabInboxItem = getLeadLabInboxItem(inboxItemsOneOpId);

        Optional<Employee> maybeLeadEmp = leadLabInboxItem.getAssignedToPersonId() != null ?
            employeeRepository.findByFactsPersonId(leadLabInboxItem.getAssignedToPersonId())
            : Optional.empty();

        LabGroup labGroup = maybeLeadEmp.map(Employee::getLabGroup).orElseGet(() -> {
            if ( leadLabInboxItem.getAssignedToPersonId() != null )
                logAssignedEmployeeNotFound("create-sample-op", leadLabInboxItem, Optional.empty(), Optional.of(
                    "The new sample op will be assigned to the administrative lab group for the organization, and " +
                    "this employee assignment will be ignored."
                ));
            return getAdministrativeLabGroup(leadLabInboxItem.getAccomplishingOrg());
        });

        SampleOp sampleOp = sampleOpRepository.save(
            new SampleOp(
                leadLabInboxItem.getWorkId(),
                labGroup,
                leadLabInboxItem.getSampleTrackingNum(),
                leadLabInboxItem.getSampleTrackingSubNum(),
                leadLabInboxItem.getPacCode(),
                leadLabInboxItem.getLidCode().orElse(null),
                leadLabInboxItem.getProblemAreaFlag(),
                leadLabInboxItem.getCfsanProductDesc(),
                leadLabInboxItem.getSplitInd().orElse(null),
                leadLabInboxItem.getStatusCode(),
                leadLabInboxItem.getStatusDate(),
                Instant.now(),
                leadLabInboxItem.getSamplingOrg(),
                leadLabInboxItem.getSubject().orElse(null),
                leadLabInboxItem.getOperationCode(),
                leadLabInboxItem.getSampleAnalysisId(),
                leadLabInboxItem.getWorkRqstId()
            )
        );

        if ( !labGroup.getFactsParentOrgName().equals(leadLabInboxItem.getAccomplishingOrg()) )
        {
            log.warn(
                "New sample op "  + describeSampleOp(sampleOp) + " wil be put in lab group with parent organization " +
                "\"" + labGroup.getFactsParentOrgName() + "\" which differs from that specified in the source lab " +
                "inbox items " + describeLabInboxItemGroup(inboxItemsOneOpId) + ". The lab group was found by the " +
                "assigned employee #" + leadLabInboxItem.getAssignedToPersonId() + "."
            );
        }

        // Create the employee assignments from the inbox items.

        inboxItemsOneOpId.forEach(inboxItem -> {

            Long assignedPersonId = inboxItem.getAssignedToPersonId();

            if ( assignedPersonId != null )
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
                    if ( !assignedPersonId.equals(leadLabInboxItem.getAssignedToPersonId()) ) // missing lead emp already logged
                    {
                        logAssignedEmployeeNotFound("create-sample-op", inboxItem, Optional.empty(), Optional.of(
                            "This employee assignment will be ignored."
                        ));
                    }
                }
            }
        });
    }

    @Transactional
    public void updateSampleOp(SampleOp sampleOp, List<LabInboxItem> inboxItems)
    {
        verifySingleOplId(sampleOp.getWorkId(), inboxItems);

        log.info("Updating sample op from lab inbox items group " + describeLabInboxItemGroup(inboxItems));

        LabInboxItem leadLabInboxItem = getLeadLabInboxItem(inboxItems);

        setSampleFieldValuesFromInboxItem(sampleOp, leadLabInboxItem);

        Optional<Employee> maybeLeadEmp = leadLabInboxItem.getAssignedToPersonId() != null ?
            employeeRepository.findByFactsPersonId(leadLabInboxItem.getAssignedToPersonId())
            : Optional.empty();

        if ( !maybeLeadEmp.isPresent() )
        {
            logAssignedEmployeeNotFound("update-sample-op", leadLabInboxItem, Optional.of(sampleOp), Optional.of(
                "The lab group and assigned employees will not be modified for this sample op."
            ));
        }
        else
        {
            // Change the lab group based on the assigned employee if necessary.
            LabGroup empLabGroup = maybeLeadEmp.get().getLabGroup();

            if ( !empLabGroup.getName().equals(sampleOp.getLabGroup().getName()) )
            {
                String origLabGroupName = sampleOp.getLabGroup().getName();

                sampleOp.setLabGroup(empLabGroup);

                log.info(
                    "The sample op being updated "  + describeSampleOp(sampleOp) + " will be moved from lab group " +
                    "\"" + origLabGroupName + "\" to lab group \"" + empLabGroup.getName() + "\" based on the " +
                    "assigned employee #" + leadLabInboxItem.getAssignedToPersonId() + "."
                );
            }
        }

        // Warn if the lab group parent organization does not match that specified in the inbox item.
        if ( !sampleOp.getLabGroup().getFactsParentOrgName().equals(leadLabInboxItem.getAccomplishingOrg()) )
        {
            log.warn(
                "The sample op being updated "  + describeSampleOp(sampleOp) + " is in lab group with parent " +
                "organization \"" + sampleOp.getLabGroup().getFactsParentOrgName() + "\" which differs from that" +
                "specified in the source lab inbox item " + describeLabInboxItemGroup(inboxItems) + ". The lab" +
                "group was found by the assigned employee #" + leadLabInboxItem.getAssignedToPersonId() + "."
            );
        }

        SampleOp savedSampleOp = sampleOpRepository.save(sampleOp);

        updateSampleOpAssignments(savedSampleOp, inboxItems);
    }

    private void updateSampleOpAssignments(SampleOp sampleOp, List<LabInboxItem> inboxItems)
    {
        List<SampleOpAssignment> existingAssignments = sampleOpAssignmentRepository.findBySampleOpId(sampleOp.getId());

        Map<Long, LabInboxItem> unprocessedInboxItemsByPersonId =
            inboxItems.stream()
            .collect(toMap(LabInboxItem::getAssignedToPersonId, Function.identity()));

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

        unprocessedInboxItemsByPersonId.values().forEach(labInboxItem -> {

            Long assignedPersonId = labInboxItem.getAssignedToPersonId();

            if ( assignedPersonId != null )
            {
                Optional<Employee> maybeEmp = employeeRepository.findByFactsPersonId(assignedPersonId);

                if ( maybeEmp.isPresent() )
                {
                    boolean lead = "Y".equals(labInboxItem.getAssignedToLeadInd());
                    Instant assigned = labInboxItem.getAssignedToStatusDate();

                    sampleOpAssignmentRepository.save(new SampleOpAssignment(sampleOp, maybeEmp.get(), assigned, lead));
                }
                else // employee not found
                {
                    logAssignedEmployeeNotFound("update-sample-op", labInboxItem, Optional.empty(), Optional.of(
                        "This employee assignment could not be created."
                    ));
                }
            }
        });
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

    /// Get a lab inbox item with lead assignment indicator on, or else the first item with any assignment, or else
    /// just the first inbox item.
    private LabInboxItem getLeadLabInboxItem(List<LabInboxItem> inboxItems)
    {
        return
            inboxItems.stream()
            .filter(item -> Objects.equals(item.getAssignedToLeadInd(), "Y"))
            .findAny()
            .orElseGet(() ->
                // no assigned user is lead, just try to find an item with a non-null assigned employee
                inboxItems.stream()
                .filter(item -> item.getAssignedToPersonId() != null)
                .findAny()
                // no assigned employees found, just return first item
                .orElse(inboxItems.get(0))
            );
    }

    private LabGroup getAdministrativeLabGroup(String parentOrg)
    {
        String name = parentOrg + "-admin";

        Optional<LabGroup> existingLabGroup = labGroupRepository.findByNameAndFactsParentOrgName(name, parentOrg);

        return existingLabGroup.orElseGet(() ->
            labGroupRepository.save(
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
            )
        );
    }

    private void setSampleFieldValuesFromInboxItem(SampleOp sampleOp, LabInboxItem labInboxItem)
    {
        if ( !sampleOp.getSampleTrackingNumber().equals(labInboxItem.getSampleTrackingNum()) ||
             !sampleOp.getSampleTrackingSubNumber().equals(labInboxItem.getSampleTrackingSubNum()) )
        {
            log.warn(
                "Updating sample tracking number/sub number for sample " + describeSampleOp(sampleOp) + ", which do not " +
                "match those of the lab inbox item matched by work id."
            );
            sampleOp.setSampleTrackingNumber(labInboxItem.getSampleTrackingNum());
            sampleOp.setSampleTrackingSubNumber(labInboxItem.getSampleTrackingSubNum());
        }

        sampleOp.setPac(labInboxItem.getPacCode());
        sampleOp.setPaf(labInboxItem.getProblemAreaFlag());
        sampleOp.setLid(labInboxItem.getLidCode().orElse(null));
        sampleOp.setProductName(labInboxItem.getCfsanProductDesc());
        sampleOp.setFactsStatus(labInboxItem.getStatusCode());
        sampleOp.setFactsStatusTimestamp(labInboxItem.getStatusDate());
        sampleOp.setSamplingOrganization(labInboxItem.getSamplingOrg());
        sampleOp.setSubject(labInboxItem.getSubject().orElse(null));
        sampleOp.setOperationCode(labInboxItem.getOperationCode());
        sampleOp.setSampleAnalysisId(labInboxItem.getSampleAnalysisId());
        sampleOp.setWorkRequestId(labInboxItem.getWorkRqstId());

        sampleOp.setLastRefreshedFromFacts(Instant.now());
    }

    private void logAssignedEmployeeNotFound
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

        sampleOpRefreshNoticeRepository.save(
            new SampleOpRefreshNotice(
                Instant.now(),
                action,
                "assigned employee not found",
                maybeSample.map(sample -> sample.getLabGroup().getFactsParentOrgName()).orElse(null),
                labInboxItem.getAccomplishingOrg(),
                maybeSample.map(sample -> toJsonString(jsonSerializer, new ReportingSampleOp(sample))).orElse(null),
                toJsonString(jsonSerializer, labInboxItem)
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

