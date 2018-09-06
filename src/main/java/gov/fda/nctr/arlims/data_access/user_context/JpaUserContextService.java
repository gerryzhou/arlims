package gov.fda.nctr.arlims.data_access.user_context;

import java.sql.ResultSet;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonMap;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.data_access.raw.jpa.*;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Employee;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Role;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.LabGroup;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Test;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.LabResource;


@Service
public class JpaUserContextService extends ServiceBase implements UserContextService
{
    private final EmployeeRepository employeeRepo;
    private final LabGroupRepository labGroupRepo;
    private final SampleRepository sampleRepo;
    private final SampleAssignmentRepository sampleAssignmentRepo;
    private final TestRepository testRepo;
    private final LabResourceRepository labResourceRepo;
    private final RoleRepository roleRepo;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder bcryptEncoder;
    private final AuditLogService dataChangeAuditingSvc;

    private Map<String, AppUser> usersByUsername;

    private final Pattern barPattern = Pattern.compile("\\|");

    private static List<String> ACTIVE_SAMPLE_STATUSES = Arrays.asList("Assigned", "In-progress", "Original complete");

    public JpaUserContextService
        (
            EmployeeRepository employeeRepo,
            LabGroupRepository labGroupRepo,
            SampleRepository sampleRepo,
            SampleAssignmentRepository sampleAssignmentRepo,
            TestRepository testRepo,
            LabResourceRepository labResourceRepo,
            RoleRepository roleRepo,
            NamedParameterJdbcTemplate jdbcTemplate,
            BCryptPasswordEncoder bcryptEncoder,
            AuditLogService dataChangeAuditingSvc
        )
    {
        this.employeeRepo = employeeRepo;
        this.labGroupRepo = labGroupRepo;
        this.sampleRepo = sampleRepo;
        this.sampleAssignmentRepo = sampleAssignmentRepo;
        this.testRepo = testRepo;
        this.labResourceRepo = labResourceRepo;
        this.roleRepo = roleRepo;
        this.jdbcTemplate = jdbcTemplate;
        this.bcryptEncoder = bcryptEncoder;
        this.usersByUsername = new ConcurrentHashMap<>(500);
        this.dataChangeAuditingSvc = dataChangeAuditingSvc;
    }

    @Transactional
    @Override
    public LabGroupContents getLabGroupContents(long employeeId)
    {
        LabGroup labGroup = this.labGroupRepo.findByEmployeeId(employeeId).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<Sample> samples = getLabGroupActiveSamples(labGroup, users);

        List<LabResource> labResources = getLabGroupLabResources(labGroup);

        return
            new LabGroupContents(
                labGroup.getId(),
                labGroup.getName(),
                testTypes,
                users,
                samples,
                labResources
            );
    }

    @Transactional
    @Override
    public void createNewUser(UserRegistration reg, AppUser creatingUser)
    {
        LabGroup labGroup = labGroupRepo.findById(reg.getLabGroupId()).orElseThrow(() ->
            new RuntimeException("Employee lab group was not found.")
        );

        if ( creatingUser.getLabGroupId() != reg.getLabGroupId() )
            throw new BadRequestException("Cannot create a user in a different lab group.");

        if ( reg.getPassword() == null || reg.getPassword().length() < 8 )
            throw new BadRequestException("Password is too short.");

        String encodedPassword = bcryptEncoder.encode(reg.getPassword());

        List<RoleName> roleNames = reg.getRoleNames().stream().map(RoleName::valueOf).collect(toList());
        Set<Role> roles = new HashSet<>(roleRepo.findByNameIn(roleNames));

        Employee emp =
            new Employee(
                reg.getUsername(),
                reg.getShortName(),
                labGroup,
                reg.getFactsPersonId().orElse(null),
                encodedPassword,
                reg.getLastName().orElse(null),
                reg.getFirstName().orElse(null),
                reg.getMiddleName().orElse(null),
                roles
            );

        employeeRepo.save(emp);

        logNewUser(emp.getId(), reg, creatingUser);
    }

    private void logNewUser(long newEmpId, UserRegistration reg, AppUser creatingUser)
    {
        UserRegistration logReg =
            new UserRegistration(
                newEmpId,
                reg.getUsername(),
                reg.getShortName(),
                reg.getLabGroupId(),
                null,
                reg.getFactsPersonId(),
                reg.getLastName(),
                reg.getFirstName(),
                reg.getMiddleName(),
                reg.getRoleNames()
            );

        try
        {
            ObjectWriter jsonWriter = this.dataChangeAuditingSvc.getJsonWriter();

            this.dataChangeAuditingSvc.addEntry(
                Instant.now(),
                creatingUser.getLabGroupId(),
                Optional.empty(),
                creatingUser.getEmployeeId(),
                creatingUser.getUsername(),
                "create",
                "user",
                Optional.empty(),
                Optional.empty(),
                Optional.of(jsonWriter.writeValueAsString(logReg))
            );
        }
        catch(JsonProcessingException jpe)
        {
            throw new RuntimeException(jpe);
        }
    }

    @Transactional
    @Override
    public AppUser loadUser(String username)
    {
        Employee emp = employeeRepo.findWithRolesByFdaEmailAccountName(username).orElseThrow(() ->
            new UsernameNotFoundException("employee record not found for user '" + username + "'")
        );

        AppUser user = makeUser(emp);

        usersByUsername.put(user.getUsername(), user);

        return  user;
    }

    @Override
    public AppUser getUser(String username)
    {
        AppUser user = usersByUsername.get(username);

        if ( user != null )
            return user;
        else
            return loadUser(username);
    }

    @Transactional
    @Override
    public UserContext getUserContext(String username)
    {
        Employee emp = employeeRepo.findWithLabGroupByFdaEmailAccountName(username).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        LabGroup labGroup = emp.getLabGroup();

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<Sample> samples = getLabGroupActiveSamples(labGroup, users);

        List<LabResource> labResources = getLabGroupLabResources(labGroup);

        AppUser user = makeUser(emp);

        usersByUsername.put(user.getUsername(), user);

        return
            new UserContext(
                user,
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
            new HashMap<>(); // getUnmanagedResourceListsBySampleId(sampleIds);

        Map<Long, List<LabResourceListMetadata>> managedResourceListsBySampleId =
            new HashMap<>(); // getManagedResourceListsBySampleId(sampleIds);

        Map<Long, List<Test>> testsBySampleId =
            getTestsBySampleId(sampleIds);

        Map<Long, Integer> attachedFileCountsByTestId =
            getAttachedFileCountsByTestId(sampleIds);

        return
            dbSamples.stream()
            .map(dbSample -> {
                long sampleId = dbSample.getId();

                List<SampleAssignment> assignments =
                    sampleAssignmentsBySampleId.getOrDefault(sampleId, emptyList());

                List<LabTestMetadata> tests =
                    testsBySampleId.getOrDefault(sampleId, emptyList()).stream()
                    .map(test -> {
                        int numAttachedFiles = attachedFileCountsByTestId.getOrDefault(test.getId(),0);
                        return makeLabTestMetadata(test, dbSample, numAttachedFiles, usersById);
                    })
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

    private Map<Long, Integer> getAttachedFileCountsByTestId(List<Long> testSampleIds)
    {
        Map<Long, Integer> res = new HashMap<>();

        String sql =
            "select tf.test_id, count(*) files\n" +
            "from test_file tf\n" +
            "where tf.test_id in (select t.id from test t where t.sample_id in (:sampleIds))\n" +
            "group by tf.test_id";

        Map<String,Object> params = new HashMap<>();
        params.put("sampleIds", testSampleIds);

        jdbcTemplate.query(sql, params, rs -> {
            res.put(rs.getLong(1), rs.getInt(2));
        });

        return res;
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
                    lgtt.getTestType().getShortName(),
                    opt(lgtt.getTestType().getDescription()),
                    opt(lgtt.getTestConfigurationJson()),
                    parseReportNames(lgtt.getReportNamesBarSeparated())
                )
            )
            .collect(toList());
    }

    private List<String> parseReportNames(String namesBarSeparated)
    {
        if ( namesBarSeparated == null )
            return Collections.emptyList();
        else
            return Arrays.asList(barPattern.split(namesBarSeparated));
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
            int attachedFilesCount,
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

        Optional<String> savedToFactsByUserShortName =
            opt(t.getSavedToFactsByEmpId())
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
                t.getTestType().getShortName(),
                t.getCreated(),
                createdByUserShortName,
                t.getLastSaved(),
                lastSavedByUserShortName,
                attachedFilesCount,
                opt(t.getBeginDate()),
                opt(t.getNote()),
                opt(t.getStageStatusesJson()),
                opt(t.getReviewed()),
                reviewedByUserShortName,
                opt(t.getSavedToFacts()),
                savedToFactsByUserShortName
            );
    }

    private AppUser makeUser(Employee emp)
    {
        List<RoleName> roleNames = emp.getRoles().stream().map(Role::getName).collect(toList());

        AppUser user =
            new AppUser(
                emp.getId(),
                emp.getFdaEmailAccountName(),
                opt(emp.getFactsPersonId()),
                emp.getShortName(),
                emp.getLabGroupId(),
                emp.getLastName(),
                emp.getFirstName(),
                roleNames,
                Instant.now()
            );

        return user;
    }

    private static <T> Optional<T> opt(T t) { return Optional.ofNullable(t); }
}
