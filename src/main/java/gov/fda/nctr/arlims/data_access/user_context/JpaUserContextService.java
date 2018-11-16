package gov.fda.nctr.arlims.data_access.user_context;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import javax.transaction.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.data_access.raw.jpa.*;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.*;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.LabResource;
import gov.fda.nctr.arlims.models.dto.SampleAssignment;


@Service
public class JpaUserContextService extends ServiceBase implements UserContextService
{
    private final EmployeeRepository employeeRepo;
    private final LabGroupRepository labGroupRepo;
    private final SampleOpRepository sampleOpRepo;
    private final SampleOpAssignmentRepository sampleOpAssignmentRepo;
    private final TestRepository testRepo;
    private final LabResourceRepository labResourceRepo;
    private final RoleRepository roleRepo;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder bcryptEncoder;
    private final AuditLogService dataChangeAuditingSvc;

    private Map<String, AppUser> usersByUsername;

    private final Pattern barPattern = Pattern.compile("\\|");

    private static List<String> USER_CONTEXT_SAMPLE_OP_STATUSES = Arrays.asList("S", "I", "O");


    public JpaUserContextService
        (
            EmployeeRepository employeeRepo,
            LabGroupRepository labGroupRepo,
            SampleOpRepository sampleOpRepo,
            SampleOpAssignmentRepository sampleOpAssignmentRepo,
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
        this.sampleOpRepo = sampleOpRepo;
        this.sampleOpAssignmentRepo = sampleOpAssignmentRepo;
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
        Set<Role> roles = !roleNames.isEmpty() ? new HashSet<>(roleRepo.findByNameIn(roleNames)): new HashSet<>();

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
        List<SampleOp> dbSampleOps =
            sampleOpRepo.findByLabGroupIdAndFactsStatusIn(labGroup.getId(), USER_CONTEXT_SAMPLE_OP_STATUSES);

        List<Long> sampleOpIds = dbSampleOps.stream().map(SampleOp::getId).collect(toList());

        Map<Long, UserReference> usersById =
            labGroupUsers.stream()
            .collect(Collectors.toMap(UserReference::getEmployeeId, userRef -> userRef));

        Map<Long, List<SampleAssignment>> sampleAssignmentsBySampleOpId = getSampleAssignmentsBySampleOpId(sampleOpIds, usersById);

        Map<Long, List<Test>> testsBySampleOpId = getTestsBySampleOpId(sampleOpIds);

        Map<Long, Integer> attachedFileCountsByTestId = getAttachedFileCountsByTestId(sampleOpIds);

        return
            dbSampleOps.stream()
            .map(dbSample -> {
                long sampleOpId = dbSample.getId();

                List<SampleAssignment> assignments =
                    sampleAssignmentsBySampleOpId.getOrDefault(sampleOpId, emptyList());

                List<LabTestMetadata> tests =
                    testsBySampleOpId.getOrDefault(sampleOpId, emptyList()).stream()
                    .map(test -> {
                        int numAttachedFiles = attachedFileCountsByTestId.getOrDefault(test.getId(),0);
                        return makeLabTestMetadata(test, dbSample, numAttachedFiles, usersById);
                    })
                    .collect(toList());

                String sampleNum = dbSample.getSampleTrackingNumber() + "-" +
                                   dbSample.getSampleTrackingSubNumber();

                return
                    new Sample(
                        dbSample.getId(),
                        sampleNum,
                        dbSample.getPac(),
                        opt(dbSample.getLid()),
                        opt(dbSample.getPaf()),
                        dbSample.getProductName(),
                        opt(dbSample.getSplitInd()),
                        dbSample.getFactsStatus(),
                        dbSample.getFactsStatusTimestamp(),
                        dbSample.getLastRefreshedFromFacts(),
                        opt(dbSample.getSamplingOrganization()),
                        opt(dbSample.getSubject()),
                        assignments,
                        tests
                    );
            })
            .collect(toList());
    }

    private Map<Long, Integer> getAttachedFileCountsByTestId(List<Long> testSampleOpIds)
    {
        Map<Long, Integer> res = new HashMap<>();

        if ( testSampleOpIds.isEmpty() )
            return res;

        String sql =
            "select tf.test_id, count(*) files\n" +
            "from test_file tf\n" +
            "where tf.test_id in (select t.id from test t where t.sample_op_id in (:sampleOpIds))\n" +
            "group by tf.test_id";

        Map<String,Object> params = new HashMap<>();
        params.put("sampleOpIds", testSampleOpIds);

        jdbcTemplate.query(sql, params, rs -> {
            res.put(rs.getLong(1), rs.getInt(2));
        });

        return res;
    }

    private Map<Long, List<Test>> getTestsBySampleOpId(List<Long> sampleOpIds)
    {
        return !sampleOpIds.isEmpty() ?
            testRepo.findBySampleOpIdIn(sampleOpIds).stream().collect(groupingBy(Test::getSampleOpId))
            : new HashMap<>();
    }

    private Map<Long, List<SampleAssignment>> getSampleAssignmentsBySampleOpId
        (
            List<Long> sampleOpIds,
            Map<Long, UserReference> usersById
        )
    {
        if ( sampleOpIds.isEmpty() )
            return new HashMap<>();
        else return
            sampleOpAssignmentRepo.findBySampleOpIdIn(sampleOpIds).stream()
            .map(a -> {
                String empShortName =
                    opt(usersById.get(a.getEmployeeId()))
                    .map(UserReference::getShortName)
                    .orElse("NA");

                return
                    new SampleAssignment(
                        a.getSampleOpId(),
                        empShortName,
                        opt(a.getAssignedInstant()),
                        opt(a.getLead())
                    );
            })
            .collect(groupingBy(SampleAssignment::getSampleId));
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
            SampleOp s,
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

        String sampleNum = s.getSampleTrackingNumber() + "-" +
                           s.getSampleTrackingSubNumber();

        return
            new LabTestMetadata(
                t.getId(),
                s.getId(),
                sampleNum,
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

        LabGroup lg = emp.getLabGroup();

        return
            new AppUser(
                emp.getId(),
                emp.getFdaEmailAccountName(),
                opt(emp.getFactsPersonId()),
                emp.getShortName(),
                emp.getLabGroupId(),
                lg.getName(),
                lg.getFactsOrgName(),
                lg.getFactsParentOrgName(),
                emp.getLastName(),
                emp.getFirstName(),
                roleNames,
                Instant.now()
            );
    }

    private static <T> Optional<T> opt(T t) { return Optional.ofNullable(t); }
}
