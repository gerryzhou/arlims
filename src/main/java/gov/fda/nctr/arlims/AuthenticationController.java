package gov.fda.nctr.arlims;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.config.AuthenticationConfig;
import gov.fda.nctr.arlims.data_access.EmployeeRepository;
import gov.fda.nctr.arlims.data_access.entities.EmployeeRecord;
import gov.fda.nctr.arlims.models.dto.AuthenticatedUser;
import gov.fda.nctr.arlims.models.dto.AuthenticationResult;
import gov.fda.nctr.arlims.models.dto.Employee;


@RestController
@RequestMapping("/api/auth")
public class AuthenticationController
{
    private final EmployeeRepository employeeRepository;
    private final AuthenticationConfig config;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    private static final String GENERIC_AUTH_FAILURE_MSG = "username/password combination is not correct";
    private static final String USER_NOT_FOUND_MSG = "user not found";

    public AuthenticationController
        (
            EmployeeRepository employeeRepository,
            AuthenticationConfig config
        )
    {
        this.employeeRepository = employeeRepository;
        this.config = config;
    }

    @PostMapping("password")
    public AuthenticationResult authenticate
        (
            @RequestParam("username") String username,
            @RequestParam("password") String password
        )
    {
        List<EmployeeRecord> rcds = employeeRepository.findByUsername(username);

        if ( rcds.isEmpty() )
            return new AuthenticationResult(Optional.empty(), Optional.of(getUserNotFoundMessage()));
        else
        {
            if ( rcds.size() > 1 )
                throw new RuntimeException("multiple employees found for username '" + username + "'");

            EmployeeRecord rcd = rcds.get(0);

            if ( !hashPassword(password).equals(rcd.getPassword()) )
            {
                return new AuthenticationResult(Optional.empty(), Optional.of(GENERIC_AUTH_FAILURE_MSG));
            }
            else
            {
                String authToken = "ABC123"; // TODO

                Employee emp = new Employee(
                    rcd.getFactsId(), rcd.getUsername(), rcd.getLabGroupName(), Optional.of(rcd.getLastName()), Optional.of(rcd.getFirstName())
                );

                AuthenticatedUser authUser = new AuthenticatedUser(emp, authToken, Instant.now());

                return new AuthenticationResult(Optional.of(authUser), Optional.empty());
            }
        }
    }

    private String getUserNotFoundMessage()
    {
        return config.getReportUserNotFoundSpecifically() ? USER_NOT_FOUND_MSG : GENERIC_AUTH_FAILURE_MSG;
    }

    private String hashPassword(String password)
    {
        System.out.println("Password hash: " + passwordEncoder.encode(password));
        return passwordEncoder.encode(password);
    }
}
