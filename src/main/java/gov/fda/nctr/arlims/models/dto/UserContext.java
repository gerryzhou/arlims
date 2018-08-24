package gov.fda.nctr.arlims.models.dto;


public class UserContext
{
    private final User user;
    private final LabGroupContents labGroupContents;

    public UserContext
        (
            User user,
            LabGroupContents labGroupContents
        )
    {
        this.user = user;
        this.labGroupContents = labGroupContents;
    }

    public User getUser() { return user; }

    public LabGroupContents getLabGroupContents() { return labGroupContents; }
}
