package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Optional;


public class AuthenticatedUser
{
    private final long employeeId;
    private final String fdaEmailAccountName;
    private final Optional<Long> factsPersonId;
    private final String shortName;
    private final long labGroupId;
    private final String lastName;
    private final String firstName;

    private final Instant authenticationInstant;


    public AuthenticatedUser
        (
            long employeeId,
            String fdaEmailAccountName,
            Optional<Long> factsPersonId,
            String shortName,
            long labGroupId,
            String lastName,
            String firstName,
            Instant authenticationInstant
        )
    {
        this.employeeId = employeeId;
        this.fdaEmailAccountName = fdaEmailAccountName;
        this.factsPersonId = factsPersonId;
        this.shortName = shortName;
        this.labGroupId = labGroupId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.authenticationInstant = authenticationInstant;
    }

    public long getEmployeeId() { return employeeId; }

    public String getFdaEmailAccountName() { return fdaEmailAccountName; }

    public Optional<Long> getFactsPersonId() { return factsPersonId; }

    public String getShortName() { return shortName; }

    public long getLabGroupId() { return labGroupId; }

    public String getLastName() { return lastName; }

    public String getFirstName() { return firstName; }

    public Instant getAuthenticationInstant() { return authenticationInstant; }
}
