package gov.fda.nctr.arlims.data_access.user_context;

import gov.fda.nctr.arlims.models.dto.*;


public interface UserContextService
{
    UserContext getUserContext(String username);

    LabGroupContents getLabGroupContents(long factsPersonId, LabGroupContentsScope contentsScope);

    AppUser loadUser(String username);

    AppUser getUser(String username);

    void createNewUser(UserRegistration userRegistration, AppUser creatingUser);
}
