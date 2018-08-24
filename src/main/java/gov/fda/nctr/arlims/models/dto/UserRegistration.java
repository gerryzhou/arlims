package gov.fda.nctr.arlims.models.dto;

import java.util.List;
import java.util.Optional;


public class UserRegistration
{
    private long id;

    private String fdaEmailAccountName;

    private String shortName;

    private long labGroupId;

    private String password;

    private Optional<Long> factsPersonId;

    private Optional<String> lastName;

    private Optional<String> firstName;

    private Optional<String> middleName;

    private List<String> rolesNames;

    protected UserRegistration() {}

    public UserRegistration
        (
            long id,
            String fdaEmailAccountName,
            String shortName,
            long labGroupId,
            String password,
            Optional<Long> factsPersonId,
            Optional<String> lastName,
            Optional<String> firstName,
            Optional<String> middleName,
            List<String> rolesNames
        )
    {
        this.id = id;
        this.fdaEmailAccountName = fdaEmailAccountName;
        this.shortName = shortName;
        this.labGroupId = labGroupId;
        this.password = password;
        this.factsPersonId = factsPersonId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.rolesNames = rolesNames;
    }

    public long getId() { return id; }

    public String getFdaEmailAccountName() { return fdaEmailAccountName; }

    public String getShortName() { return shortName; }

    public long getLabGroupId() { return labGroupId; }

    public String getPassword() { return password; }

    public Optional<Long> getFactsPersonId() { return factsPersonId; }

    public Optional<String> getLastName() { return lastName; }

    public Optional<String> getFirstName() { return firstName; }

    public Optional<String> getMiddleName() { return middleName; }

    public List<String> getRoleNames() { return rolesNames; }
}
