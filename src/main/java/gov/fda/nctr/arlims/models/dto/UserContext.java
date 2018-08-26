package gov.fda.nctr.arlims.models.dto;


public class UserContext
{
    private final AppUser user;
    private final LabGroupContents labGroupContents;

    public UserContext
        (
            AppUser user,
            LabGroupContents labGroupContents
        )
    {
        this.user = user;
        this.labGroupContents = labGroupContents;
    }

    public AppUser getUser() { return user; }

    public LabGroupContents getLabGroupContents() { return labGroupContents; }
}
