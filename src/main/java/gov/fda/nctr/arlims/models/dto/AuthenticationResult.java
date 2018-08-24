package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;

public class AuthenticationResult
{
    private final boolean authenticated;
    private final Optional<User> authenticatedUser;
    private final Optional<String> authenticationToken;

    public AuthenticationResult
        (
            boolean authenticated,
            Optional<User> authenticatedUser,
            Optional<String> authenticationToken
        )
    {
        this.authenticated = authenticated;
        this.authenticatedUser = authenticatedUser;
        this.authenticationToken = authenticationToken;
        if ( authenticatedUser.isPresent() != authenticationToken.isPresent() )
            throw new RuntimeException("Authenticated user should be supplied iff authentication token is.");
    }

    public boolean getAuthenticated() { return authenticated; }

    public Optional<User> getAuthenticatedUser() { return authenticatedUser; }

    public Optional<String> getAuthenticationToken() { return authenticationToken; }
}
