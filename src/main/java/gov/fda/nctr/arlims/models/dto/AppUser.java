package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import static java.util.stream.Collectors.toList;

import org.springframework.security.core.GrantedAuthority;
import com.fasterxml.jackson.annotation.JsonIgnore;


public class AppUser
{
    private final long employeeId;
    private final String username;
    private final long factsPersonId;
    private final String shortName;
    private final long labGroupId;
    private String labGroupName;
    private String labGroupFactsOrgName;
    private String factsFdaOrgName;
    private final String lastName;
    private final String firstName;
    private final List<RoleName> roles;
    private final Instant userInfoLastRefreshedInstant;

    @JsonIgnore
    private final Collection<? extends GrantedAuthority> grantedAuthorities;

    public AppUser
        (
            long employeeId,
            String username,
            long factsPersonId,
            String shortName,
            long labGroupId,
            String labGroupName,
            String labGroupFactsOrgName,
            String factsFdaOrgName,
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
        this.labGroupName = labGroupName;
        this.labGroupFactsOrgName = labGroupFactsOrgName;
        this.factsFdaOrgName = factsFdaOrgName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.roles = roles;
        this.userInfoLastRefreshedInstant = userInfoLastRefreshedInstant;
        this.grantedAuthorities = roles.stream().map(role -> new RoleAuthority("ROLE_" + role.name())).collect(toList());
    }

    public long getEmployeeId() { return employeeId; }

    public String getUsername() { return username; }

    public Long getFactsPersonId() { return factsPersonId; }

    public String getShortName() { return shortName; }

    public long getLabGroupId() { return labGroupId; }

    public String getLabGroupName() { return labGroupName; }

    public String getLabGroupFactsOrgName() { return labGroupFactsOrgName; }

    public String getFactsFdaOrgName() { return factsFdaOrgName; }

    public String getLastName() { return lastName; }

    public String getFirstName() { return firstName; }

    public List<RoleName> getRoles() { return roles; }

    public Instant getUserInfoLastRefreshedInstant() { return userInfoLastRefreshedInstant; }

    public Collection<? extends GrantedAuthority> getGrantedAuthorities() { return grantedAuthorities; }
}

class RoleAuthority implements GrantedAuthority
{
    private final String role;

    RoleAuthority(String role) { this.role = role; }

    @Override
    public String getAuthority() { return role; }

    @Override
    public String toString() { return "RoleAuthority[" + role + "]"; }
}

