package gov.fda.nctr.arlims.models.dto;

import java.util.Objects;

public class Employee
{
    long factsId;
    String shortName;
    String labGroupName;
    String lastName;
    String firstName;

    public Employee(long factsId, String shortName, String labGroupName, String lastName, String firstName)
    {
        Objects.requireNonNull(shortName, "employee short name is required");
        Objects.requireNonNull(shortName, "employee lab group name is required");

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

    public String getLastName()
    {
        return lastName;
    }

    public String getFirstName()
    {
        return firstName;
    }
}
