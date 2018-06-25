package gov.fda.nctr.arlims;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.data_access.UserContextService;
import gov.fda.nctr.arlims.models.dto.UserContext;


@RestController
@RequestMapping("/api/user")
public class UserController
{
    private final UserContextService userContextService;

    public UserController(UserContextService userContextService)
    {
        this.userContextService = userContextService;
    }

    private final Logger log = LoggerFactory.getLogger(this.getClass());


    @GetMapping("context")
    public UserContext getUserContext
        (
            @RequestHeader HttpHeaders httpHeaders
        )
    {
        String fdaEmailAccountName = "stephen.harris"; // TODO

        return userContextService.getUserContext(fdaEmailAccountName);
    }

}
