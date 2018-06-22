package gov.fda.nctr.arlims.models.dto;

import java.util.List;


public class UserContext
{
    private final AuthenticatedUser authenticatedUser;
    private final String labGroupName;
    private final List<LabTestType> labGroupTestTypes;

    public UserContext
        (
            AuthenticatedUser authenticatedUser,
            String labGroupName,
            List<LabTestType> labGroupTestTypes
        )
    {
        this.authenticatedUser = authenticatedUser;
        this.labGroupName = labGroupName;
        this.labGroupTestTypes = labGroupTestTypes;
    }

    public AuthenticatedUser getAuthenticatedUser() { return authenticatedUser; }

    public String getLabGroupName() { return labGroupName; }

    public List<LabTestType> getLabGroupTestTypes() { return labGroupTestTypes; }
}
