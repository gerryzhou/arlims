package gov.fda.nctr.arlims;

import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.data_access.UserContextService;
import gov.fda.nctr.arlims.models.dto.User;
import gov.fda.nctr.arlims.models.dto.AuthenticationResult;
import gov.fda.nctr.arlims.models.dto.LabGroupContents;
import gov.fda.nctr.arlims.models.dto.UserContext;


@RestController
@RequestMapping("/api/user")
public class UserController
{
    private final UserContextService userContextService;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public UserController(UserContextService userContextService)
    {
        this.userContextService = userContextService;
    }

    @GetMapping("context")
    public UserContext getUserContext
        (
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        String username = "stephen.harris"; // TODO

        return userContextService.getUserContext(username);
    }

    @PostMapping("login")
    public AuthenticationResult login
        (
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        // TODO: Do authentication here.
        boolean authSuccess = true;

        if ( authSuccess )
        {
            String authToken = "TODO"; // TODO
            User user = userContextService.loadUser(username);
            return new AuthenticationResult(true, Optional.of(user), Optional.of(authToken));
        }
        else
            return new AuthenticationResult(false, Optional.empty(), Optional.empty());
    }

    @GetMapping("{empId:\\d+}/lab-group-contents")
    public LabGroupContents getLabGroupContents
        (
            @PathVariable("empId") long empId,
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        return userContextService.getLabGroupContents(empId);
    }

}
