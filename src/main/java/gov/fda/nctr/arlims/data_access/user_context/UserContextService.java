package gov.fda.nctr.arlims.data_access.user_context;

import gov.fda.nctr.arlims.models.dto.AppUser;
import gov.fda.nctr.arlims.models.dto.LabGroupContents;
import gov.fda.nctr.arlims.models.dto.UserContext;
import gov.fda.nctr.arlims.models.dto.UserRegistration;


public interface UserContextService
{
    UserContext getUserContext(String username);

    AppUser loadUser(String username);

    AppUser getUser(String username);

    LabGroupContents getLabGroupContents(long employeeId);

    void createNewUser(UserRegistration userRegistration);
}
