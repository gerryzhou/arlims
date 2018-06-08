package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


public class AuthenticatedUser
{
    private final Employee emp;
    private final String authenticationToken;
    private final Instant authenticationInstant;

    public AuthenticatedUser(Employee emp, String authenticationToken, Instant authenticationInstant)
    {
        this.emp = emp;
        this.authenticationToken = authenticationToken;
        this.authenticationInstant = authenticationInstant;
    }

    public Employee getEmp() { return emp; }

    public String getAuthenticationToken() { return authenticationToken; }

    public Instant getAuthenticationInstant() { return authenticationInstant; }
}
