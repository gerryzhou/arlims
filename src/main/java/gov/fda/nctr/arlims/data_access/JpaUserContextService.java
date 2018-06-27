package gov.fda.nctr.arlims.data_access;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import static java.util.stream.Collectors.toList;

import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.raw.jpa.EmployeeRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.LabResourceRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.ReceivedSampleRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.TestRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.*;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.LabResource;


@Service
public class JpaUserContextService implements UserContextService
{
    private final EmployeeRepository employeeRepository;
    private final ReceivedSampleRepository receivedSampleRepository;
    private final TestRepository testRepository;
    private final LabResourceRepository labResourceRepository;

    public JpaUserContextService
        (
            EmployeeRepository employeeRepository,
            ReceivedSampleRepository receivedSampleRepository,
            TestRepository testRepository,
            LabResourceRepository labResourceRepository
        )
    {
        this.employeeRepository = employeeRepository;
        this.receivedSampleRepository = receivedSampleRepository;
        this.testRepository = testRepository;
        this.labResourceRepository = labResourceRepository;
    }

    // TODO: This does too many fetches, implement without JPA or optimize the JPA as much as possible.
    //       Try adding EntityGraph annotation, see:
    //         https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.entity-graph
    @Transactional
    public UserContext getUserContext(String userFdaAccountName)
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO: Obtain from some header value or a lookup based on a header value.

        Employee emp = employeeRepository.findByFdaEmailAccountName(fdaEmailAccountName).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<RoleName> roleNames = emp.getRoles().stream().map(Role::getName).collect(toList());

        LabGroup labGroup = emp.getLabGroup();

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<Sample> samples = new ArrayList<>();
        for ( ReceivedSample receivedSample : receivedSampleRepository.findByLabGroupIdAndActive(labGroup.getId(), true) )
        {
            List<String> assignedUsers = getSampleAssignedUserShortNames(receivedSample);

            List<LabTestMetadata> tests = getSampleTestMetadatas(receivedSample);

            List<SampleListMetadata> containingSampleLists = new ArrayList<>(); // TODO

            samples.add(
                new Sample(
                    receivedSample.getId(),
                    receivedSample.getSampleNumber(),
                    Optional.ofNullable(receivedSample.getPacCode()),
                    receivedSample.getProductName(),
                    receivedSample.getActive(),
                    receivedSample.getReceived(),
                    Optional.ofNullable(receivedSample.getTestBeginDate()),
                    assignedUsers,
                    tests,
                    containingSampleLists
                )
            );
        }

        List<LabResource> labResources = getLabGroupLabResources(labGroup);

        return new UserContext(
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

    private List<LabResource> getLabGroupLabResources(LabGroup labGroup)
    {
        return
            labResourceRepository.findByLabGroupId(labGroup.getId()).stream()
            .map(lr -> new LabResource(lr.getCode(), lr.getLabResourceType(), Optional.ofNullable(lr.getDescription())))
            .collect(toList());
    }

    private List<LabTestMetadata> getSampleTestMetadatas(ReceivedSample receivedSample)
    {
        return
            testRepository.findBySampleId(receivedSample.getId()).stream()
            .map(t ->
                new LabTestMetadata(
                    t.getId(),
                    receivedSample.getId(),
                    receivedSample.getSampleNumber(),
                    receivedSample.getPacCode(),
                    Optional.ofNullable(receivedSample.getProductName()),
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

    private List<String> getSampleAssignedUserShortNames(ReceivedSample receivedSample)
    {
        return
            receivedSample.getAssignedToEmployees().stream()
            .map(e -> e.getShortName())
            .collect(toList());
    }

    private List<UserReference> getLabGroupUsers(LabGroup labGroup)
    {
        return
            labGroup.getEmployees().stream()
            .map(e -> new UserReference(e.getId(), e.getFdaEmailAccountName(), e.getShortName()))
            .collect(toList());
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
            ).collect(toList());
    }
}
