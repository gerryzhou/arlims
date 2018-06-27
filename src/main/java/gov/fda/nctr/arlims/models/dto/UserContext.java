package gov.fda.nctr.arlims.models.dto;


public class UserContext
{
    private final AuthenticatedUser authenticatedUser;
    private final LabGroupContents labGroupContents;

    public UserContext
        (
            AuthenticatedUser authenticatedUser,
            LabGroupContents labGroupContents
        )
    {
        this.authenticatedUser = authenticatedUser;
        this.labGroupContents = labGroupContents;
    }

    public AuthenticatedUser getAuthenticatedUser() { return authenticatedUser; }

    public LabGroupContents getLabGroupContents() { return labGroupContents; }
}
