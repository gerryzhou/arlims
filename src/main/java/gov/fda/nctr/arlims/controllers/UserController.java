package gov.fda.nctr.arlims.controllers;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletResponse;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import gov.fda.nctr.arlims.data_access.user_context.UserContextService;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.security.AppUserAuthentication;


@RestController
@RequestMapping("/api/user")
public class UserController extends ControllerBase
{
    private final UserContextService userContextService;

    public UserController(UserContextService userContextService)
    {
        this.userContextService = userContextService;
    }

    @PostMapping("register")
    @RolesAllowed("ROLE_ADMIN")
    public void registerNewUser
        (
            @RequestBody UserRegistration userRegistration,
            Authentication authentication
        )
    {

        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        try
        {
            userContextService.createNewUser(userRegistration, currentUser);
        }
        catch(DataAccessException e)
        {
            String msg = e.toString();
            if ( msg.contains(".UN_EMP_") )
                throw new BadRequestException("The entered data conflicts with one or more existing records, please choose unique values where required.");
            else
                throw e;
        }
    }

    @GetMapping("context")
    public UserContext getUserContext(Authentication authentication)
    {
        return userContextService.getUserContext(authentication.getName());
    }

    @GetMapping("lab-group-contents")
    public LabGroupContents getLabGroupContents
        (
            @RequestParam("scope") LabGroupContentsScope contentsScope,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        return userContextService.getLabGroupContents(currentUser.getFactsPersonId(), contentsScope);
    }


    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public String handleBadRequestException
        (
            BadRequestException e,
            WebRequest request,
            HttpServletResponse response
        )
    {
        return e.getMessage();
    }
}
