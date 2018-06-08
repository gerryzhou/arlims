package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class AuthenticationResult
{
    private final Optional<AuthenticatedUser> authenticatedUser;
    private final Optional<String> failureMessage;

    public AuthenticationResult
        (
            Optional<AuthenticatedUser> authenticatedUser,
            Optional<String> failureMessage
        )
    {
        this.authenticatedUser = authenticatedUser;
        this.failureMessage = failureMessage;
    }

    public Optional<AuthenticatedUser> getAuthenticatedUser() { return authenticatedUser; }

    public Optional<String> getAuthenticationFailureMessage() { return failureMessage; }
}
