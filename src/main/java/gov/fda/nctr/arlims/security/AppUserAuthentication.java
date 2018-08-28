package gov.fda.nctr.arlims.security;

import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import gov.fda.nctr.arlims.models.dto.AppUser;


public class AppUserAuthentication implements Authentication
{
    private final AppUser appUser;

    public AppUserAuthentication(AppUser appUser)
    {
        this.appUser = appUser;
    }

    public AppUser getAppUser() { return appUser; }

    public Collection<? extends GrantedAuthority> getAuthorities() { return appUser.getGrantedAuthorities(); }

    public Object getCredentials() { return null; }

    public Object getDetails() { return appUser; }

    public Object getPrincipal() { return appUser.getUsername(); }

    public boolean isAuthenticated() { return true; }

    public void setAuthenticated(boolean b) throws IllegalArgumentException
    {
        if ( !b ) throw new IllegalArgumentException("Cannot setAuthenticated(false) on AppUserAutentication.");
    }

    public String getName() { return appUser.getUsername(); }
}
