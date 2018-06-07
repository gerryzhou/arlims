package gov.fda.nctr.arlims.models.dto;

import java.util.Objects;
import java.util.Optional;


public class User
{
    long factsId;
    String shortName;
    String labGroupName;
    Optional<String> lastName;
    Optional<String> firstName;

    public User(long factsId, String shortName, String labGroupName, Optional<String> lastName, Optional<String> firstName)
    {
        Objects.requireNonNull(shortName, "employee short name is required");
        Objects.requireNonNull(labGroupName, "employee lab group name is required");

        this.factsId = factsId;
        this.shortName = shortName;
        this.labGroupName = labGroupName;
        this.lastName = lastName;
        this.firstName = firstName;
    }

    public long getFactsId()
    {
        return factsId;
    }

    public String getShortName()
    {
        return shortName;
    }

    public String getLabGroupName()
    {
        return labGroupName;
    }

    public Optional<String> getLastName()
    {
        return lastName;
    }

    public Optional<String> getFirstName()
    {
        return firstName;
    }
}
