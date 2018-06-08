package gov.fda.nctr.arlims.models.dto;

import java.util.Objects;
import java.util.Optional;


public class Employee
{
    long empId;
    String username;
    String labGroupName;
    Optional<String> lastName;
    Optional<String> firstName;

    public Employee(long empId, String username, String labGroupName, Optional<String> lastName, Optional<String> firstName)
    {
        Objects.requireNonNull(username, "employee username is required");
        Objects.requireNonNull(labGroupName, "employee lab group name is required");

        this.empId = empId;
        this.username = username;
        this.labGroupName = labGroupName;
        this.lastName = lastName;
        this.firstName = firstName;
    }

    public long getId()
    {
        return empId;
    }

    public String getUsername()
    {
        return username;
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
