package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class UserContext
{
    private final AppUser user;
    private final LabGroupContents labGroupContents;
    private final Optional<AppVersion> applicationVersion;

    public UserContext
        (
            AppUser user,
            LabGroupContents labGroupContents,
            Optional<AppVersion> applicationVersion
        )
    {
        this.user = user;
        this.labGroupContents = labGroupContents;
        this.applicationVersion = applicationVersion;
    }

    public AppUser getUser() { return user; }

    public LabGroupContents getLabGroupContents() { return labGroupContents; }

    public Optional<AppVersion> getApplicationVersion() { return applicationVersion; }
}
