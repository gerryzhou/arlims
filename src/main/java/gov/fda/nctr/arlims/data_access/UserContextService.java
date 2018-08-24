package gov.fda.nctr.arlims.data_access;

import gov.fda.nctr.arlims.models.dto.User;
import gov.fda.nctr.arlims.models.dto.LabGroupContents;
import gov.fda.nctr.arlims.models.dto.UserContext;
import gov.fda.nctr.arlims.models.dto.UserRegistration;


public interface UserContextService
{
    UserContext getUserContext(String username);

    User loadUser(String username);

    User loadUser(long empId);

    User getUser(long empId);

    LabGroupContents getLabGroupContents(long employeeId);

    void registerNewUser(UserRegistration userRegistration);
}
