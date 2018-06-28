package gov.fda.nctr.arlims.data_access;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import static java.util.stream.Collectors.toList;

import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.raw.jpa.EmployeeRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.LabResourceRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.SampleRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.TestRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Employee;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Role;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.LabGroup;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.LabResource;


@Service
public class JpaUserContextService implements UserContextService
{
    private final EmployeeRepository employeeRepository;
    private final SampleRepository sampleRepository;
    private final TestRepository testRepository;
    private final LabResourceRepository labResourceRepository;

    private static List<String> ACTIVE_SAMPLE_STATUSES = Arrays.asList("Assigned", "In-progress", "Original complete");


    public JpaUserContextService
        (
            EmployeeRepository employeeRepository,
            SampleRepository sampleRepository,
            TestRepository testRepository,
            LabResourceRepository labResourceRepository
        )
    {
        this.employeeRepository = employeeRepository;
        this.sampleRepository = sampleRepository;
        this.testRepository = testRepository;
        this.labResourceRepository = labResourceRepository;
    }

    // TODO This implementation does far too many individual queries.
    //   Implement without JPA or optimize the JPA as much as possible.
    //   Try adding EntityGraph annotation, see:
    //     https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.entity-graph
    @Transactional
    public UserContext getUserContext(String fdaEmailAccountName)
    {
        Employee emp = employeeRepository.findByFdaEmailAccountName(fdaEmailAccountName).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<RoleName> roleNames = emp.getRoles().stream().map(Role::getName).collect(toList());

        LabGroup labGroup = emp.getLabGroup();

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<Sample> samples =
            sampleRepository.findByLabGroupIdAndFactsStatusIn(labGroup.getId(), ACTIVE_SAMPLE_STATUSES).stream()
            .map(this::getSample)
            .collect(toList());

        List<LabResource> labResources = getLabGroupLabResources(labGroup);

        return
            new UserContext(
                new AuthenticatedUser(
                    emp.getId(),
                    emp.getFdaEmailAccountName(),
                    Optional.ofNullable(emp.getFactsPersonId()),
                    emp.getShortName(),
                    labGroup.getId(),
                    emp.getLastName(),
                    emp.getFirstName(),
                    roleNames,
                    Instant.now()
                ),
                new LabGroupContents(labGroup.getId(), labGroup.getName(), testTypes, users, samples, labResources)
            );
    }

    private List<LabTestType> getLabGroupTestTypes(LabGroup labGroup)
    {
        return
        labGroup
        .getTestTypes().stream()
        .map(lgtt ->
        new LabTestType(
        lgtt.getTestType().getId(),
        lgtt.getTestType().getCode(),
        lgtt.getTestType().getName(),
        Optional.ofNullable(lgtt.getTestType().getDescription())
        )
        )
        .collect(toList());
    }

    private List<UserReference> getLabGroupUsers(LabGroup labGroup)
    {
        return
        labGroup.getEmployees().stream()
        .map(e -> new UserReference(e.getId(), e.getFdaEmailAccountName(), e.getShortName()))
        .collect(toList());
    }


    private Sample getSample(gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample sample)
    {
        List<SampleAssignment> assignments = getSampleAssignments(sample);

        List<LabTestMetadata> tests = getSampleTestMetadatas(sample);

        return
            new Sample(
                sample.getId(),
                sample.getSampleNumber(),
                sample.getPac(),
                Optional.ofNullable(sample.getLid()),
                Optional.ofNullable(sample.getPaf()),
                sample.getProductName(),
                Optional.ofNullable(sample.getReceived()),
                sample.getFactsStatus(),
                sample.getFactsStatusDate(),
                sample.getLastRefreshedFromFacts(),
                Optional.ofNullable(sample.getSamplingOrganization()),
                Optional.ofNullable(sample.getSubject()),
                assignments,
                tests
            );
    }

    private List<LabResource> getLabGroupLabResources(LabGroup labGroup)
    {
        return
            labResourceRepository.findByLabGroupId(labGroup.getId()).stream()
            .map(lr -> new LabResource(lr.getCode(), lr.getLabResourceType(), Optional.ofNullable(lr.getDescription())))
            .collect(toList());
    }

    private List<LabTestMetadata> getSampleTestMetadatas(gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample sample)
    {
        return
            testRepository.findBySampleId(sample.getId()).stream()
            .map(t ->
                new LabTestMetadata(
                    t.getId(),
                    sample.getId(),
                    sample.getSampleNumber(),
                    sample.getPac(),
                    Optional.ofNullable(sample.getProductName()),
                    t.getTestType().getCode(),
                    t.getTestType().getName(),
                    t.getCreated(),
                    t.getCreatedByEmployee().getShortName(),
                    t.getLastSaved(),
                    t.getLastSavedByEmployee().getShortName(),
                    Optional.ofNullable(t.getBeginDate()),
                    Optional.ofNullable(t.getNote()),
                    Optional.ofNullable(t.getReviewed()),
                    Optional.ofNullable(t.getReviewedByEmployee()).map(Employee::getShortName),
                    Optional.ofNullable(t.getSavedToFacts())
                )
            )
            .collect(toList());
    }

    private List<SampleAssignment> getSampleAssignments(gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample sample)
    {
        return
            sample.getAssignments().stream()
            .map(a ->
                new SampleAssignment(
                    a.getSampleId(),
                    a.getEmployee().getShortName(),
                    Optional.ofNullable(a.getAssignedDate()),
                    Optional.ofNullable(a.getLead()))
                )
            .collect(toList());
    }

}
