package gov.fda.nctr.arlims.data_access;

import gov.fda.nctr.arlims.models.dto.UserContext;


public interface UserContextService
{
    public UserContext getUserContext(String userFdaAccountName);
}