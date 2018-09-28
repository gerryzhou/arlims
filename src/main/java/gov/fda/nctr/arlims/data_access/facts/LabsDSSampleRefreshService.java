package gov.fda.nctr.arlims.data_access.facts;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import javax.transaction.Transactional;

import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.models.dto.LabInboxItem;
import gov.fda.nctr.arlims.data_access.raw.jpa.*;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.*;


@Service
public class LabsDSSampleRefreshService extends ServiceBase implements SampleRefreshService
{
    private FactsAccessService factsAccessService;
    private SampleRepository sampleRepository;
    private SampleAssignmentRepository sampleAssignmentRepository;
    private SampleRefreshErrorRepository sampleRefreshErrorRepository;
    private EmployeeRepository employeeRepository;
    private LabGroupRepository labGroupRepository;
    private ObjectMapper jsonSerializer;

    private static final List<String> REFRESHABLE_SAMPLE_STATUS_CODES = Arrays.asList("S", "I", "O");


    public LabsDSSampleRefreshService
        (
            FactsAccessService factsAccessService,
            SampleRepository sampleRepository,
            SampleAssignmentRepository sampleAssignmentRepository,
            SampleRefreshErrorRepository sampleRefreshErrorRepository,
            EmployeeRepository employeeRepository,
            LabGroupRepository labGroupRepository
        )
    {
        this.factsAccessService = factsAccessService;
        this.sampleRepository = sampleRepository;
        this.sampleAssignmentRepository = sampleAssignmentRepository;
        this.sampleRefreshErrorRepository = sampleRefreshErrorRepository;
        this.employeeRepository = employeeRepository;
        this.labGroupRepository = labGroupRepository;

        this.jsonSerializer = Jackson2ObjectMapperBuilder.json().build();
        this.jsonSerializer.registerModule(new JavaTimeModule());
    }

    @Transactional
    public void refreshSamplesFromFacts()
    {
        List<LabInboxItem> labInboxItems = factsAccessService.getLabInboxItems(REFRESHABLE_SAMPLE_STATUS_CODES);

        log.info("Refreshing samples with " + labInboxItems.size() + " FACTS lab inbox items.");

        Map<Long, LabInboxItem> labInboxItemsByOpId =
            labInboxItems.stream()
            .filter(item -> item.getSampleTrackingNum() != null)
            .collect(toMap(LabInboxItem::getWorkId, Function.identity(), this::pickOneIfSameSampleAssignment));

        Map<Long, Sample> matchedSamplesByOpId =
            sampleRepository.findByWorkIdIn(labInboxItemsByOpId.keySet()).stream()
            .collect(toMap(Sample::getWorkId, Function.identity()));

        Map<Long, Sample> activeSamplesByOpId =
            sampleRepository.findByFactsStatusIn(REFRESHABLE_SAMPLE_STATUS_CODES).stream()
            .collect(toMap(Sample::getWorkId, Function.identity()));


        // Create new samples for inbox items that have no matching sample.

        List<LabInboxItem> unmatchedInboxItems =
            labInboxItemsByOpId.values().stream()
            .filter(item -> !matchedSamplesByOpId.containsKey(item.getWorkId()))
            .collect(toList());

        SuccessFailCounts createCounts = createSamplesForInboxItems(unmatchedInboxItems);


        // Update samples which are matched to inbox items.

        SuccessFailCounts updateCounts = updateSamplesForInboxItems(matchedSamplesByOpId.values(), labInboxItemsByOpId);


        // Update statuses for active samples that don't have a matching inbox item.

        List<Sample> unmatchedActiveSamples =
            activeSamplesByOpId.values().stream()
            .filter(sample -> !matchedSamplesByOpId.containsKey(sample.getWorkId()))
            .collect(toList());

        SuccessFailCounts unmatchedSampleStatusUpdateCounts = updateSampleStatuses(unmatchedActiveSamples);


        log.info("Completed refresh of sample information from FACTS lab inbox: " +
            createCounts.succeeded + " samples created, " +
            (createCounts.failed> 0 ? createCounts.failed + " samples failed to be created," : "" ) +
            updateCounts.succeeded + " samples updated, " +
            (updateCounts.failed > 0 ? updateCounts.failed + " failed to be updated," : "" ) +
            unmatchedSampleStatusUpdateCounts.succeeded + " unmatched sample statuses updated" +
            (unmatchedSampleStatusUpdateCounts.failed > 0 ?
                ", " + unmatchedSampleStatusUpdateCounts.failed   + " unmatched sample statuses failed to be updated."
                : "." )
        );
    }

    // Returns the first item (arbitrarily) if the items have the same sample and assigned employee,
    // else throws RuntimeException. This is used to discard duplicate objects being returned by LABS-DS api.
    private LabInboxItem pickOneIfSameSampleAssignment(LabInboxItem item1, LabInboxItem item2)
    {
        if ( item1.hasSameSampleAssignment(item2) )
            return item1;
        else
            throw new RuntimeException(
                "Inbox items have same op id but different sample assignments: " + item1 + ", " + item2
            );
    }

    private SuccessFailCounts createSamplesForInboxItems(List<LabInboxItem> inboxItems)
    {
        int succeeded = 0, failed = 0;

        for ( LabInboxItem inboxItem : inboxItems )
        {
            try
            {
                createSample(inboxItem);

                ++succeeded;
            }
            catch(Exception e)
            {
                log.warn(
                    "Failed to create sample for lab inbox item " + describeLabInboxItem(inboxItem) + ": " +
                    e.getMessage()
                );

                sampleRefreshErrorRepository.save(
                    new SampleRefreshError(
                        Instant.now(),
                        "create-sample",
                        e.getMessage(),
                        null,
                        inboxItem.getAccomplishingOrg(),
                        null,
                        toJsonString(inboxItem)
                    )
                );

                ++failed;
            }
        }

        return new SuccessFailCounts(succeeded, failed);
    }

    private void createSample(LabInboxItem labInboxItem)
    {
        log.info("Creating sample for lab inbox item " + describeLabInboxItem(labInboxItem));

        Optional<Employee> maybeEmp = employeeRepository.findByFactsPersonId(labInboxItem.getAssignedToPersonId());

        LabGroup labGroup = maybeEmp.map(Employee::getLabGroup).orElseGet(() -> {

            logAssignedEmployeeNotFound("create-sample", labInboxItem, Optional.empty(), Optional.of(
                "The new sample will be assigned to the administrative lab group for the organization."
            ));

            return getAdministrativeLabGroup(labInboxItem.getAccomplishingOrg());

        });

        Sample sample = sampleRepository.save(
            new Sample(
                labInboxItem.getWorkId(),
                labGroup,
                labInboxItem.getSampleTrackingNum(),
                labInboxItem.getSampleTrackingSubNum(),
                labInboxItem.getPacCode(),
                labInboxItem.getLidCode().orElse(null),
                labInboxItem.getProblemAreaFlag(),
                labInboxItem.getCfsanProductDesc(),
                labInboxItem.getSplitInd().orElse(null),
                labInboxItem.getStatusCode(),
                labInboxItem.getStatusDate(),
                Instant.now(),
                labInboxItem.getSamplingOrg(),
                labInboxItem.getSubject().orElse(null),
                labInboxItem.getOperationCode(),
                labInboxItem.getSampleAnalysisId(),
                labInboxItem.getWorkRqstId()
            )
        );

        if ( !labGroup.getFactsParentOrgName().equals(labInboxItem.getAccomplishingOrg()) )
        {
            log.warn(
                "New sample "  + describeSample(sample) + " is being put in lab group with parent organization " +
                "\"" + labGroup.getFactsParentOrgName() + "\" which differs from that specified in the source lab " +
                "inbox item " + describeLabInboxItem(labInboxItem) + ". The lab group was found by the assigned " +
                "employee #" + labInboxItem.getAssignedToPersonId() + "."
            );
        }

        maybeEmp.ifPresent(emp -> sampleAssignmentRepository.save(
            new SampleAssignment(sample, emp, labInboxItem.getAssignedToStatusDate(), true)
        ));
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

    private SuccessFailCounts updateSamplesForInboxItems
        (
            Collection<Sample> samples,
            Map<Long, LabInboxItem> labInboxItemsByOpId
        )
    {
        int succeeded = 0, failed = 0;

        for ( Sample sample : samples )
        {
            LabInboxItem inboxItem = labInboxItemsByOpId.get(sample.getWorkId());

            try
            {
                updateSample(sample, inboxItem);

                ++succeeded;
            }
            catch(Exception e)
            {

                log.warn(
                    "Failed to update sample " + sample + " for lab inbox item " + describeLabInboxItem(inboxItem) + ": " +
                    e.getMessage()
                );

                sampleRefreshErrorRepository.save(
                    new SampleRefreshError(
                        Instant.now(),
                        "update-sample",
                        e.getMessage(),
                        sample.getLabGroup().getFactsParentOrgName(),
                        inboxItem.getAccomplishingOrg(),
                        toJsonString(sample),
                        toJsonString(inboxItem)
                    )
                );

                ++failed;
            }
        }

        return new SuccessFailCounts(succeeded, failed);
    }

    private void updateSample(Sample sample, LabInboxItem labInboxItem)
    {
        log.info("Updating sample from lab inbox item " + describeLabInboxItem(labInboxItem));

        setSampleFieldValuesFromInboxItem(sample, labInboxItem);

        Optional<Employee> maybeEmp = employeeRepository.findByFactsPersonId(labInboxItem.getAssignedToPersonId());

        if ( !maybeEmp.isPresent() )
        {
            logAssignedEmployeeNotFound("update-sample", labInboxItem, Optional.of(sample), Optional.of(
                "The lab group and assigned employees will not be modified for this sample."
            ));
        }
        else
        {
            // Change the lab group based on the assigned employee if necessary.
            LabGroup empLabGroup = maybeEmp.get().getLabGroup();

            if ( !empLabGroup.getName().equals(sample.getLabGroup().getName()) )
            {
                String origLabGroupName = sample.getLabGroup().getName();

                sample.setLabGroup(empLabGroup);

                log.info(
                    "Updated sample "  + describeSample(sample) + " is being moved from lab group " +
                    "\"" + origLabGroupName + "\" to lab group \"" + empLabGroup.getName() + "\" based on the " +
                    "assigned employee #" + labInboxItem.getAssignedToPersonId() + "."
                );
            }
        }

        // Warn if the lab group parent organization does not match that specified in the inbox item.
        if ( !sample.getLabGroup().getFactsParentOrgName().equals(labInboxItem.getAccomplishingOrg()) )
        {
            log.warn(
                "Updated sample "  + describeSample(sample) + " is in lab group with parent organization " +
                "\"" + sample.getLabGroup().getFactsParentOrgName() + "\" which differs from that specified in the " +
                "source lab inbox item " + describeLabInboxItem(labInboxItem) + ". The lab group was found by the " +
                "assigned employee #" + labInboxItem.getAssignedToPersonId() + "."
            );
        }

        Sample savedSample = sampleRepository.save(sample);

        maybeEmp.ifPresent(emp -> {
            Set<SampleAssignment> existingAssignments = savedSample.getAssignments();
            SampleAssignment inboxAssignment = new SampleAssignment(savedSample, emp, labInboxItem.getAssignedToStatusDate(), true);

            if ( existingAssignments.size() != 1 ||
                 !sampleAssignmentsEqual(existingAssignments.iterator().next(), inboxAssignment) )
            {
                sampleAssignmentRepository.deleteBySampleIdEquals(savedSample.getId());

                sampleAssignmentRepository.save(inboxAssignment);
            }
        });
    }

    private void setSampleFieldValuesFromInboxItem(Sample sample, LabInboxItem labInboxItem)
    {
        if ( !sample.getSampleTrackingNumber().equals(labInboxItem.getSampleTrackingNum()) ||
             !sample.getSampleTrackingSubNumber().equals(labInboxItem.getSampleTrackingSubNum()) )
        {
            log.warn(
                "Updating sample tracking number/sub number for sample " + describeSample(sample) + ", which do not " +
                "match those of the lab inbox item matched by work id."
            );
            sample.setSampleTrackingNumber(labInboxItem.getSampleTrackingNum());
            sample.setSampleTrackingSubNumber(labInboxItem.getSampleTrackingSubNum());
        }

        sample.setPac(labInboxItem.getPacCode());
        sample.setPaf(labInboxItem.getProblemAreaFlag());
        sample.setLid(labInboxItem.getLidCode().orElse(null));
        sample.setProductName(labInboxItem.getCfsanProductDesc());
        sample.setFactsStatus(labInboxItem.getStatusCode());
        sample.setFactsStatusTimestamp(labInboxItem.getStatusDate());
        sample.setSamplingOrganization(labInboxItem.getSamplingOrg());
        sample.setSubject(labInboxItem.getSubject().orElse(null));
        sample.setOperationCode(labInboxItem.getOperationCode());
        sample.setSampleAnalysisId(labInboxItem.getSampleAnalysisId());
        sample.setWorkRequestId(labInboxItem.getWorkRqstId());

        sample.setLastRefreshedFromFacts(Instant.now());
    }

    private SuccessFailCounts updateSampleStatuses(List<Sample> samples)
    {
        int succeeded = 0, failed = 0;

        for ( Sample sample : samples )
        {
            try
            {
                updateUnmatchedSampleStatus(sample);

                ++succeeded;
            }
            catch(Exception e)
            {
                log.warn("Failed to update status for sample " + sample + ": " + e.getMessage());

                sampleRefreshErrorRepository.save(
                    new SampleRefreshError(
                        Instant.now(),
                        "update-unmatched-sample-status",
                        e.getMessage(),
                        sample.getLabGroup().getFactsParentOrgName(),
                        null,
                        toJsonString(sample),
                        null
                    )
                );

                ++failed;
            }
        }

        return new SuccessFailCounts(succeeded, failed);
    }

    private void updateUnmatchedSampleStatus(Sample sample)
    {
        log.info("Updating status for unmatched database sample " + describeSample(sample));

        String statusCode = factsAccessService.getWorkStatus(sample.getWorkId()).orElse("U");

        if ( statusCode.equals("U") )
            log.info("Could not find status for orphaned sample " + describeSample(sample) + ", " +
                     "setting to inactive unknown status 'U'.");

        sample.setFactsStatus(statusCode);

        sampleRepository.save(sample);
    }

    private void logAssignedEmployeeNotFound
        (
            String action,
            LabInboxItem labInboxItem,
            Optional<Sample> maybeSample,
            Optional<String> consequencesMessage
        )
    {
        log.warn(
            "Assigned employee not found for inbox item " + describeLabInboxItem(labInboxItem) + " for " +
            action + " operation" +
            ( maybeSample.map(sample -> " on sample " + describeSample(sample)).orElse("") ) + "." +
            consequencesMessage.map(msg -> " " + msg).orElse("")
        );

        sampleRefreshErrorRepository.save(
            new SampleRefreshError(
                Instant.now(),
                action,
                "assigned employee not found",
                maybeSample.map(sample -> sample.getLabGroup().getFactsParentOrgName()).orElse(null),
                labInboxItem.getAccomplishingOrg(),
                maybeSample.map(this::toJsonString).orElse(null),
                toJsonString(labInboxItem)
            )
        );
    }

    private String toJsonString(Object o)
    {
        try
        {
            return jsonSerializer.writeValueAsString(o);
        }
        catch(Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    private static String describeLabInboxItem(LabInboxItem labInboxItem)
    {
        return
            "[" + labInboxItem.getSampleTrackingNum() + "-" + labInboxItem.getSampleTrackingSubNum() +
            " " + labInboxItem.getCfsanProductDesc() + "" +
            ", assigned-to=" + describeAssignedEmployee(labInboxItem) +
            ", org=\"" + labInboxItem.getAccomplishingOrg() + "\"" +
            ", work-id=" + labInboxItem.getWorkId() + "]";
    }

    private static String describeAssignedEmployee(LabInboxItem labInboxItem)
    {
        return
            "{" + labInboxItem.getAssignedToFirstName() + " " + labInboxItem.getAssignedToLastName() +
            ", id=" + labInboxItem.getAssignedToPersonId() + "}";
    }

    private static String describeSample(Sample sample)
    {
        return
            "[" + sample.getSampleTrackingNumber() + "-" + sample.getSampleTrackingSubNumber() +
            " \"" + sample.getProductName() + "\"" +
            ", lab-group=\"" + sample.getLabGroup().getName() + "\"" +
            ", parent-org=\"" + sample.getLabGroup().getFactsParentOrgName() + "\"" +
            ", work-id=" + sample.getWorkId() + "]";
    }

    private static boolean sampleAssignmentsEqual(SampleAssignment next, SampleAssignment inboxAssignment)
    {
        return
            next.getEmployeeId().equals(inboxAssignment.getEmployeeId()) &&
            next.getSampleId().equals(inboxAssignment.getSampleId()) &&
            next.getLead() == inboxAssignment.getLead() &&
            next.getAssignedInstant().equals(inboxAssignment.getAssignedInstant());
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