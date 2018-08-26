package gov.fda.nctr.arlims;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.data_access.UserContextService;
import gov.fda.nctr.arlims.models.dto.*;


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

    @PostMapping("register")
    public void registerNewUser
        (
            @RequestBody UserRegistration userRegistration
        )
    {
        userContextService.createNewUser(userRegistration);
    }

    @GetMapping("context")
    public UserContext getUserContext(Authentication auth)
    {
        return userContextService.getUserContext(auth.getName());
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
