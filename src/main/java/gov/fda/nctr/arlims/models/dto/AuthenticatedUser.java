package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


public class AuthenticatedUser
{
    private final User user;
    private final String authenticationToken;
    private final Instant authenticationInstant;

    public AuthenticatedUser(User user, String authenticationToken, Instant authenticationInstant)
    {
        this.user = user;
        this.authenticationToken = authenticationToken;
        this.authenticationInstant = authenticationInstant;
    }

    public User getUser() { return user; }

    public String getAuthenticationToken() { return authenticationToken; }

    public Instant getAuthenticationInstant() { return authenticationInstant; }
}
