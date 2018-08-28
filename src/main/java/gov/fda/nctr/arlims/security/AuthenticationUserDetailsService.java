package gov.fda.nctr.arlims.security;

import java.util.Optional;

import static java.util.Collections.emptyList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.data_access.authentication.AuthenticatableUser;
import gov.fda.nctr.arlims.data_access.authentication.AuthenticatableUserService;


@Service
public class AuthenticationUserDetailsService implements UserDetailsService
{
    private AuthenticatableUserService authenticatableUserSvc;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public AuthenticationUserDetailsService(AuthenticatableUserService authenticatableUserSvc)
    {
        this.authenticatableUserSvc = authenticatableUserSvc;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        Optional<AuthenticatableUser> maybeAuthUser = authenticatableUserSvc.getAuthenticatableUser(username);

        return
            maybeAuthUser.map(authUser -> {
                String password = authUser.getPassword() != null ? authUser.getPassword() : "";
                return new User(authUser.getUsername(), password, emptyList());
            })
            .orElseThrow(() -> new UsernameNotFoundException("username " + username + " not found"));
    }
}
