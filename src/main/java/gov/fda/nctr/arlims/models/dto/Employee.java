package gov.fda.nctr.arlims.models.dto;

import java.util.Objects;
import java.util.Optional;


public class Employee
{
    long id;
    Optional<Long> factsPersonId;
    String username;
    String shortName;
    String labGroupName;
    String lastName;
    String firstName;

    public Employee
        (
            long id,
            Optional<Long> factsPersonId,
            String username,
            String shortName,
            String labGroupName,
            String lastName,
            String firstName
        )
    {
        Objects.requireNonNull(username, "employee username is required");
        Objects.requireNonNull(shortName, "employee short name is required");
        Objects.requireNonNull(labGroupName, "employee lab group name is required");
        Objects.requireNonNull(lastName, "employee last name is required");
        Objects.requireNonNull(firstName, "employee first name is required");

        this.id = id;
        this.factsPersonId = factsPersonId;
        this.username = username;
        this.shortName = shortName;
        this.labGroupName = labGroupName;
        this.lastName = lastName;
        this.firstName = firstName;
    }

    public long getId() { return id; }

    public Optional<Long> getFactsPersonId() { return factsPersonId; }

    public String getUsername() { return username; }

    public String getShortName() { return shortName; }

    public String getLabGroupName() { return labGroupName; }

    public String getLastName() { return lastName; }

    public String getFirstName() { return firstName; }
}
