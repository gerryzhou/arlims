package gov.fda.nctr.arlims;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import static java.util.stream.Collectors.toList;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.data_access.EmployeeRepository;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.db.Employee;
import gov.fda.nctr.arlims.models.db.LabGroup;
import gov.fda.nctr.arlims.models.db.Role;
import gov.fda.nctr.arlims.models.dto.*;


@RestController
@RequestMapping("/api/user")
public class UserController
{
    private EmployeeRepository employeeRepository;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public UserController(EmployeeRepository employeeRepository)
    {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("context")
    public UserContext getUserContext
        (
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO

        Employee emp = employeeRepository.findByFdaEmailAccountName(fdaEmailAccountName).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<RoleName> roleNames = emp.getRoles().stream().map(Role::getName).collect(toList());

        List<LabTestType> testTypes =
            emp.getLabGroup()
            .getTestTypes().stream()
            .map(lgtt ->
                new LabTestType(
                    lgtt.getTestType().getCode(),
                    lgtt.getTestType().getName(),
                    Optional.ofNullable(lgtt.getTestType().getDescription())
                )
            ).collect(toList());

        LabGroup lg = emp.getLabGroup();

        AuthenticatedUser user = new AuthenticatedUser(
            emp.getId(),
            emp.getFdaEmailAccountName(),
            Optional.ofNullable(emp.getFactsPersonId()),
            emp.getShortName(),
            lg.getId(),
            emp.getLastName(),
            emp.getFirstName(),
            roleNames,
            Instant.now()
        );

        return new UserContext(user, lg.getName(), testTypes);
    }

}
