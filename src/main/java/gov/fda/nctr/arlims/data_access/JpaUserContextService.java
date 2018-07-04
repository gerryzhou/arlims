package gov.fda.nctr.arlims.data_access;

import java.sql.ResultSet;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonMap;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import javax.transaction.Transactional;

import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.raw.jpa.*;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Employee;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Role;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.LabGroup;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Test;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.LabResource;


@Service
public class JpaUserContextService implements UserContextService
{
    private final EmployeeRepository employeeRepo;
    private final SampleRepository sampleRepo;
    private final SampleAssignmentRepository sampleAssignmentRepo;
    private final TestRepository testRepo;
    private final LabResourceRepository labResourceRepo;
    private final NamedParameterJdbcTemplate jdbcTemplate;

    private static List<String> ACTIVE_SAMPLE_STATUSES = Arrays.asList("Assigned", "In-progress", "Original complete");

    public JpaUserContextService
        (
            EmployeeRepository employeeRepo,
            SampleRepository sampleRepo,
            SampleAssignmentRepository sampleAssignmentRepo,
            TestRepository testRepo,
            LabResourceRepository labResourceRepo,
            NamedParameterJdbcTemplate jdbcTemplate
        )
    {
        this.employeeRepo = employeeRepo;
        this.sampleRepo = sampleRepo;
        this.sampleAssignmentRepo = sampleAssignmentRepo;
        this.testRepo = testRepo;
        this.labResourceRepo = labResourceRepo;
        this.jdbcTemplate = jdbcTemplate;
    }

    // TODO This implementation does too many individual queries.
    //   Implement without JPA or optimize the JPA as much as possible.
    //   Try adding EntityGraph annotation, see:
    //     https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.entity-graph
    @Transactional
    public UserContext getUserContext(String fdaEmailAccountName)
    {
        Employee emp = employeeRepo.findWithLabGroupByFdaEmailAccountName(fdaEmailAccountName).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<RoleName> roleNames = emp.getRoles().stream().map(Role::getName).collect(toList());

        LabGroup labGroup = emp.getLabGroup();

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<Sample> samples = getLabGroupActiveSamples(labGroup, users);

        List<LabResource> labResources = getLabGroupLabResources(labGroup);

        return
            new UserContext(
                new AuthenticatedUser(
                    emp.getId(),
                    emp.getFdaEmailAccountName(),
                    opt(emp.getFactsPersonId()),
                    emp.getShortName(),
                    labGroup.getId(),
                    emp.getLastName(),
                    emp.getFirstName(),
                    roleNames,
                    Instant.now()
                ),
                new LabGroupContents(
                    labGroup.getId(),
                    labGroup.getName(),
                    testTypes,
                    users,
                    samples,
                    labResources
                )
            );
    }

    private List<Sample> getLabGroupActiveSamples(LabGroup labGroup, List<UserReference> labGroupUsers)
    {
        List<gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample> dbSamples =
            sampleRepo.findByLabGroupIdAndFactsStatusIn(labGroup.getId(), ACTIVE_SAMPLE_STATUSES);

        List<Long> sampleIds = dbSamples.stream().map(s -> s.getId()).collect(toList());

        Map<Long, UserReference> usersById =
            labGroupUsers.stream()
            .collect(Collectors.toMap(UserReference::getEmployeeId, userRef -> userRef));

        Map<Long, List<SampleAssignment>> sampleAssignmentsBySampleId =
            getSampleAssignmentsBySampleId(sampleIds, usersById);

        Map<Long, List<LabResourceListMetadata>> unmanagedResourceListsBySampleId =
            getUnmanagedResourceListsBySampleId(sampleIds);

        Map<Long, List<LabResourceListMetadata>> managedResourceListsBySampleId =
            getManagedResourceListsBySampleId(sampleIds);

        Map<Long, List<Test>> testsBySampleId =
            getTestsBySampleId(sampleIds);

        return
            dbSamples.stream()
            .map(dbSample -> {
                long sampleId = dbSample.getId();

                List<SampleAssignment> assignments =
                    sampleAssignmentsBySampleId.getOrDefault(sampleId, emptyList());

                List<LabTestMetadata> tests =
                    testsBySampleId.getOrDefault(sampleId, emptyList()).stream()
                    .map(test -> makeLabTestMetadata(test, dbSample, usersById))
                    .collect(toList());

                List<LabResourceListMetadata> unmanagedResourceLists =
                    unmanagedResourceListsBySampleId.getOrDefault(sampleId, emptyList());

                List<LabResourceListMetadata> managedResourceLists =
                    managedResourceListsBySampleId.getOrDefault(sampleId, emptyList());

                return
                    new Sample(
                        dbSample.getId(),
                        dbSample.getSampleNumber(),
                        dbSample.getPac(),
                        opt(dbSample.getLid()),
                        opt(dbSample.getPaf()),
                        dbSample.getProductName(),
                        opt(dbSample.getReceived()),
                        dbSample.getFactsStatus(),
                        dbSample.getFactsStatusDate(),
                        dbSample.getLastRefreshedFromFacts(),
                        opt(dbSample.getSamplingOrganization()),
                        opt(dbSample.getSubject()),
                        assignments,
                        tests,
                        unmanagedResourceLists,
                        managedResourceLists
                    );
            })
            .collect(toList());
    }

    private Map<Long, List<Test>> getTestsBySampleId(List<Long> sampleIds)
    {
        return
            testRepo.findBySampleIdIn(sampleIds).stream()
            .collect(groupingBy(Test::getSampleId));

    }

    private Map<Long, List<SampleAssignment>> getSampleAssignmentsBySampleId
        (
            List<Long> sampleIds,
            Map<Long, UserReference> usersById
        )
    {
        return
            sampleAssignmentRepo.findBySampleIdIn(sampleIds).stream()
            .map(a -> {
                String empShortName =
                    opt(usersById.get(a.getEmployeeId()))
                    .map(UserReference::getShortName)
                    .orElse("NA");

                return
                    new SampleAssignment(
                        a.getSampleId(),
                        empShortName,
                        opt(a.getAssignedDate()),
                        opt(a.getLead())
                    );
            })
            .collect(groupingBy(SampleAssignment::getSampleId));
    }

    private Map<Long, List<LabResourceListMetadata>> getUnmanagedResourceListsBySampleId(List<Long> sampleIds)
    {
        String qry =
            "select r.sample_id, e.short_name, r.list_name, count(*) num_resources\n" +
            "from sample_unmanaged_resource r\n" +
            "join employee e on e.id = r.employee_id\n" +
            "where r.sample_id in (:ids)\n" +
            "group by r.sample_id, e.short_name, r.list_name";

        RowMapper<LabResourceListMetadata> listMdRowMapper = (rs,i) ->
            new LabResourceListMetadata(rs.getString(3), rs.getString(2), rs.getInt(4));

        return
            jdbcTemplate.query(
                qry,
                singletonMap("ids", sampleIds),
                getLabResourceListsBySampleIdResultSetExtractor(1, listMdRowMapper)
            );
    }

    private Map<Long, List<LabResourceListMetadata>> getManagedResourceListsBySampleId(List<Long> sampleIds)
    {
        String qry =
            "select r.sample_id, e.short_name, r.list_name, count(*) num_resources\n" +
            "from sample_managed_resource r\n" +
            "join employee e on e.id = r.employee_id\n" +
            "where r.sample_id in (:ids)\n" +
            "group by r.sample_id, e.short_name, r.list_name";

        RowMapper<LabResourceListMetadata> listMdRowMapper = (rs,i) ->
            new LabResourceListMetadata(rs.getString(3), rs.getString(2), rs.getInt(4));

        return
            jdbcTemplate.query(
                qry,
                singletonMap("ids", sampleIds),
                getLabResourceListsBySampleIdResultSetExtractor(1, listMdRowMapper)
            );
    }

    private ResultSetExtractor<Map<Long, List<LabResourceListMetadata>>> getLabResourceListsBySampleIdResultSetExtractor
        (
            int sampleIdColNum,
            RowMapper<LabResourceListMetadata> listMdRowMapper
        )
    {
        return (ResultSet rs) -> {
            Map<Long, List<LabResourceListMetadata>> listMdsBySampleId = new HashMap<>();
            int i = 0;
            while (rs.next())
            {
                listMdsBySampleId.computeIfAbsent(rs.getLong(sampleIdColNum), k -> new ArrayList<>())
                    .add(listMdRowMapper.mapRow(rs, ++i));
            }
            return listMdsBySampleId;
        };
    }

    private List<LabTestType> getLabGroupTestTypes(LabGroup labGroup)
    {
        return
            labGroup.getTestTypes().stream()
            .map(lgtt ->
                new LabTestType(
                    lgtt.getTestType().getId(),
                    lgtt.getTestType().getCode(),
                    lgtt.getTestType().getName(),
                    opt(lgtt.getTestType().getDescription()),
                    opt(lgtt.getTestConfigurationJson())
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

    private List<LabResource> getLabGroupLabResources(LabGroup labGroup)
    {
        return
            labResourceRepo.findByLabGroupId(labGroup.getId()).stream()
            .map(lr -> new LabResource(lr.getCode(), lr.getLabResourceType(), opt(lr.getDescription())))
            .collect(toList());
    }

    private LabTestMetadata makeLabTestMetadata
        (
            Test t,
            gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample s,
            Map<Long, UserReference> usersById
        )
    {
        String createdByUserShortName =
            opt(usersById.get(t.getCreatedByEmpId()))
            .map(UserReference::getShortName)
            .orElse("NA");

        String lastSavedByUserShortName =
            opt(usersById.get(t.getLastSavedByEmpId()))
            .map(UserReference::getShortName)
            .orElse("NA");

        Optional<String> reviewedByUserShortName =
            opt(t.getReviewedByEmpId())
            .flatMap(empId -> opt(usersById.get(empId)))
            .map(UserReference::getShortName);

        return
            new LabTestMetadata(
                t.getId(),
                s.getId(),
                s.getSampleNumber(),
                s.getPac(),
                opt(s.getProductName()),
                t.getTestType().getCode(),
                t.getTestType().getName(),
                t.getCreated(),
                createdByUserShortName,
                t.getLastSaved(),
                lastSavedByUserShortName,
                opt(t.getBeginDate()),
                opt(t.getNote()),
                opt(t.getStageStatusesJson()),
                opt(t.getReviewed()),
                reviewedByUserShortName,
                opt(t.getSavedToFacts())
            );
    }

    private static <T> Optional<T> opt(T t) { return Optional.ofNullable(t); }
}
