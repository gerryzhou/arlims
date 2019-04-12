package gov.fda.nctr.arlims.data_access.user_context;

import java.sql.ResultSet;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import static java.util.Collections.*;
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
import gov.fda.nctr.arlims.data_access.facts.FactsAccessService;
import gov.fda.nctr.arlims.data_access.facts.models.dto.EmployeeInboxItem;
import gov.fda.nctr.arlims.data_access.raw.jpa.*;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.*;
import gov.fda.nctr.arlims.data_access.version_info.AppVersionService;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.models.dto.LabResource;


@Service
public class JpaLabsDSUserContextService extends ServiceBase implements UserContextService
{
    private final FactsAccessService factsAccessService;
    private final EmployeeRepository employeeRepo;
    private final LabGroupRepository labGroupRepo;
    private final TestRepository testRepo;
    private final RoleRepository roleRepo;
    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder bcryptEncoder;
    private final AuditLogService dataChangeAuditingSvc;
    private final AppVersionService appVersionService;

    private Map<String, AppUser> usersByUsername;

    private final Pattern barPattern = Pattern.compile("\\|");

    // TODO: Add 'M' once LABS-DS issue with test data having too many records with M status is resolved.
    private final Optional<List<String>> personInboxStatuses = Optional.of(Arrays.asList("S","I","T"));

    public JpaLabsDSUserContextService
        (
            FactsAccessService factsAccessService,
            EmployeeRepository employeeRepo,
            LabGroupRepository labGroupRepo,
            TestRepository testRepo,
            RoleRepository roleRepo,
            AuditLogService dataChangeAuditingSvc,
            NamedParameterJdbcTemplate jdbcTemplate,
            BCryptPasswordEncoder bcryptEncoder,
            AppVersionService appVersionService
        )
    {
        this.factsAccessService = factsAccessService;
        this.employeeRepo = employeeRepo;
        this.labGroupRepo = labGroupRepo;
        this.testRepo = testRepo;
        this.roleRepo = roleRepo;
        this.dataChangeAuditingSvc = dataChangeAuditingSvc;
        this.jdbcTemplate = jdbcTemplate;
        this.bcryptEncoder = bcryptEncoder;
        this.appVersionService = appVersionService;

        this.usersByUsername = new ConcurrentHashMap<>(500);
    }

    @Transactional
    @Override
    public UserContext getUserContext(String username)
    {
        Employee emp = employeeRepo.findWithLabGroupByFdaEmailAccountName(username).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        CompletableFuture<List<EmployeeInboxItem>> inboxItems$ =
            factsAccessService.getPersonInboxItems(emp.getFactsPersonId(), personInboxStatuses);

        LabGroup labGroup = emp.getLabGroup();

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<LabResource> labResources = getLabGroupResources(labGroup);

        AppUser user = makeUser(emp);

        usersByUsername.put(user.getUsername(), user);

        try
        {
            List<SampleOp> userSampleOps = getUserActiveSampleOps(inboxItems$.get(), users);

            return
                new UserContext(
                    user,
                    new LabGroupContents(
                        labGroup.getId(),
                        labGroup.getName(),
                        testTypes,
                        users,
                        userSampleOps,
                        labResources
                    ),
                    appVersionService.getAppVersion()
                );
        }
        catch (InterruptedException | ExecutionException e)
        { throw new RuntimeException(e); }
    }


    @Transactional
    @Override
    public LabGroupContents getLabGroupContents(long factsPersonId)
    {
        CompletableFuture<List<EmployeeInboxItem>> inboxItems$ =
            factsAccessService.getPersonInboxItems(factsPersonId, personInboxStatuses);

        LabGroup labGroup = this.labGroupRepo.findByFactsPersonId(factsPersonId).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<LabTestType> testTypes = getLabGroupTestTypes(labGroup);

        List<UserReference> users = getLabGroupUsers(labGroup);

        List<LabResource> labResources = getLabGroupResources(labGroup);

        try
        {
            List<SampleOp> userSampleOps = getUserActiveSampleOps(inboxItems$.get(), users);

            return
                new LabGroupContents(
                    labGroup.getId(),
                    labGroup.getName(),
                    testTypes,
                    users,
                    userSampleOps,
                    labResources
                );
        }
        catch (InterruptedException | ExecutionException e)
        { throw new RuntimeException(e); }
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

    private List<SampleOp> getUserActiveSampleOps
        (
            List<EmployeeInboxItem> inboxItems,
            List<UserReference> labGroupUsers
        )
    {
        // We only want the inbox items that represent sample operations.
        List<EmployeeInboxItem> sampleOpInboxItems =
            inboxItems.stream().filter(item -> item.getSampleTrackingNumber() != null).collect(toList());

        List<Long> opIds = sampleOpInboxItems.stream().map(EmployeeInboxItem::getOperationId).collect(toList());

        Map<Long, List<Test>> testsByOpId = opIds.isEmpty() ? emptyMap()
            : testRepo.findByOpIdIn(opIds).stream().collect(groupingBy(Test::getOpId));

        Map<Long, Integer> fileCountsByTestId = getAttachedFileCountsByTestIdForTestOpIds(opIds);

        Map<Long, UserReference> usersById =
            labGroupUsers.stream()
            .collect(Collectors.toMap(UserReference::getEmployeeId, userRef -> userRef));

        return
            sampleOpInboxItems.stream()
            .map(inboxItem -> {
                long opId = inboxItem.getOperationId();

                List<LabTestMetadata> tests =
                    testsByOpId.getOrDefault(opId, emptyList()).stream()
                    .map(test -> {
                        int numAttachedFiles = fileCountsByTestId.getOrDefault(test.getId(),0);
                        return makeLabTestMetadata(test, inboxItem, numAttachedFiles, usersById);
                    })
                    .collect(toList());

                return makeSampleOp(inboxItem, tests);
            })
            .collect(toList());
    }

    private Map<Long, Integer> getAttachedFileCountsByTestIdForTestOpIds(List<Long> opIds)
    {
        Map<Long, Integer> res = new HashMap<>();

        if ( opIds.isEmpty() )
            return res;

        String sql =
            "select tf.test_id, count(*) files\n" +
            "from test_file tf\n" +
            "where tf.test_id in (select t.id from test t where t.op_id in (:opIds))\n" +
            "group by tf.test_id";

        Map<String,Object> params = new HashMap<>();
        params.put("opIds", opIds);

        jdbcTemplate.query(sql, params, rs -> {
            res.put(rs.getLong(1), rs.getInt(2));
        });

        return res;
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
            return emptyList();
        else
            return Arrays.asList(barPattern.split(namesBarSeparated));
    }

    private List<UserReference> getLabGroupUsers(LabGroup labGroup)
    {
        return
            labGroup.getEmployees().stream()
            .map(e -> new UserReference(e.getId(), e.getFactsPersonId(), e.getFdaEmailAccountName(), e.getShortName()))
            .collect(toList());
    }

    private List<LabResource> getLabGroupResources(LabGroup labGroup)
    {
        String sql =
            "select r.resource_group, r.code, r.resource_type, r.description " +
            "from lab_group_resource_group lgrg " +
            "join \"RESOURCE\" r on r.resource_group = lgrg.resource_group " +
            "where lgrg.lab_group_id = :lgid";


        Map<String,Object> params = new HashMap<>();
        params.put("lgid", labGroup.getId());

        return jdbcTemplate.query(sql, params, (ResultSet rs, int ix) ->
            new LabResource(
                rs.getString(1),
                rs.getString(2),
                LabResourceType.valueOf(rs.getString(3)),
                Optional.ofNullable(rs.getString(4))
            )
        );
    }

    private LabTestMetadata makeLabTestMetadata
        (
            Test t,
            EmployeeInboxItem inboxItem,
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
                inboxItem.getOperationId(),
                inboxItem.getSampleTrackingNumber(),
                inboxItem.getSampleTrackingSubNumber(),
                inboxItem.getPacCode(),
                inboxItem.getCfsanProductDesc(),
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

    private SampleOp makeSampleOp(EmployeeInboxItem inboxItem, List<LabTestMetadata> tests)
    {
        SampleOpAssignment assignment =
            new SampleOpAssignment(
                inboxItem.getPersonId(),
                inboxItem.getAssignedToFirstName(),
                inboxItem.getAssignedToLastName(),
                opt(inboxItem.getAssignedToMiddleName()),
                opt(inboxItem.getLeadIndicator()),
                inboxItem.getWorkAssignmentDate()
            );

        return
            new SampleOp(
                inboxItem.getOperationId(),
                inboxItem.getSampleTrackingNumber(),
                inboxItem.getSampleTrackingSubNumber(),
                inboxItem.getPacCode(),
                opt(inboxItem.getLidCode()),
                opt(inboxItem.getProblemAreaFlag()),
                inboxItem.getCfsanProductDesc(),
                opt(inboxItem.getStatusCode()),
                opt(inboxItem.getStatusDate()),
                opt(Instant.now()),
                opt(inboxItem.getSubjectText()),
                opt(tests),
                opt(singletonList(assignment))
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
                emp.getFactsPersonId(),
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
