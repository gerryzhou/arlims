package gov.fda.nctr.arlims.data_access.authentication;

import java.util.Optional;


public interface AuthenticatableUserService
{
    Optional<AuthenticatableUser> getAuthenticatableUser(String username);
}
