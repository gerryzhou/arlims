package gov.fda.nctr.arlims.data_access;

import gov.fda.nctr.arlims.models.dto.User;
import gov.fda.nctr.arlims.models.dto.LabGroupContents;
import gov.fda.nctr.arlims.models.dto.UserContext;


public interface UserContextService
{
    UserContext getUserContext(String userFdaAccountName);

    User loadUser(String fdaEmailAccountName);

    User loadUser(long empId);

    User getUser(long empId);

    LabGroupContents getLabGroupContents(long employeeId);
}
