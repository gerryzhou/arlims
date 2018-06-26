package gov.fda.nctr.arlims.data_access;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import static java.util.stream.Collectors.toList;

import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.raw.jpa.EmployeeRepository;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.LabGroup;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Role;
import gov.fda.nctr.arlims.data_access.raw.jpa.db.Employee;
import gov.fda.nctr.arlims.models.dto.AuthenticatedUser;
import gov.fda.nctr.arlims.models.dto.LabTestType;
import gov.fda.nctr.arlims.models.dto.RoleName;
import gov.fda.nctr.arlims.models.dto.UserContext;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;


@Service
public class JpaUserContextService implements UserContextService
{
    private final EmployeeRepository employeeRepository;

    public JpaUserContextService(EmployeeRepository employeeRepository)
    {
        this.employeeRepository = employeeRepository;
    }

    // TODO: This does too many fetches, implement without JPA or optimize the JPA as much as possible.
    @Transactional
    public UserContext getUserContext(String userFdaAccountName)
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO: Obtain from some header value or a lookup based on a header value.

        Employee emp = employeeRepository.findByFdaEmailAccountName(fdaEmailAccountName).orElseThrow(() ->
            new ResourceNotFoundException("employee record not found")
        );

        List<RoleName> roleNames = emp.getRoles().stream().map(Role::getName).collect(toList());

        List<LabTestType> testTypes =
            emp.getLabGroup()
            .getTestTypes().stream()
            .map(lgtt ->
                new LabTestType(
                    lgtt.getTestType().getId(),
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
