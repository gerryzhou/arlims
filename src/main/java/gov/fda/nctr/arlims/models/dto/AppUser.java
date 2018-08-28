package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import static java.util.stream.Collectors.toList;

import org.springframework.security.core.GrantedAuthority;


public class AppUser
{
    private final long employeeId;
    private final String username;
    private final Optional<Long> factsPersonId;
    private final String shortName;
    private final long labGroupId;
    private final String lastName;
    private final String firstName;
    private final List<RoleName> roles;
    private final Collection<? extends GrantedAuthority> grantedAuthorities;
    private final Instant userInfoLastRefreshedInstant;

    public AppUser
        (
            long employeeId,
            String username,
            Optional<Long> factsPersonId,
            String shortName,
            long labGroupId,
            String lastName,
            String firstName,
            List<RoleName> roles,
            Instant userInfoLastRefreshedInstant
        )
    {
        this.employeeId = employeeId;
        this.username = username;
        this.factsPersonId = factsPersonId;
        this.shortName = shortName;
        this.labGroupId = labGroupId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.roles = roles;
        this.userInfoLastRefreshedInstant = userInfoLastRefreshedInstant;
        this.grantedAuthorities = roles.stream().map(role -> new RoleAuthority("ROLE_" + role.name())).collect(toList());
    }

    public long getEmployeeId() { return employeeId; }

    public String getUsername() { return username; }

    public Optional<Long> getFactsPersonId() { return factsPersonId; }

    public String getShortName() { return shortName; }

    public long getLabGroupId() { return labGroupId; }

    public String getLastName() { return lastName; }

    public String getFirstName() { return firstName; }

    public List<RoleName> getRoles() { return roles; }

    public Instant getUserInfoLastRefreshedInstant() { return userInfoLastRefreshedInstant; }

    public Collection<? extends GrantedAuthority> getGrantedAuthorities() { return grantedAuthorities; }


    static final class RoleAuthority implements GrantedAuthority
    {
        private final String role;

        RoleAuthority(String role) { this.role = role; }

        @Override
        public String getAuthority() { return role; }

        @Override
        public String toString() { return "RoleAuthority[" + role + "]"; }
    }

}
