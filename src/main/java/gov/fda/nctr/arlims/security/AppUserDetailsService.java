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

import gov.fda.nctr.arlims.data_access.AuthenticatableUser;
import gov.fda.nctr.arlims.data_access.AuthenticatableUserService;


@Service
public class AppUserDetailsService implements UserDetailsService
{
    private AuthenticatableUserService authUserSvc;

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public AppUserDetailsService(AuthenticatableUserService authUserSvc)
    {
        this.authUserSvc = authUserSvc;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        Optional<AuthenticatableUser> maybeAuthUser = authUserSvc.getAuthenticatableUser(username);

        return
            maybeAuthUser.map(authUser -> {
                String password = authUser.getPassword() != null ? authUser.getPassword() : "";
                return new User(authUser.getUsername(), password, emptyList());
            })
            .orElseThrow(() -> new UsernameNotFoundException("username " + username + " not found"));
    }
}
