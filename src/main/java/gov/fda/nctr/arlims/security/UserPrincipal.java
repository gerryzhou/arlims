package gov.fda.nctr.arlims.security;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import gov.fda.nctr.arlims.models.db.Employee;


public class UserPrincipal implements UserDetails
{
    private long employeeId;
    private String fdaEmailAccountName;
    private Optional<Long> factsPersonId;
    private String password;
    private String labGroupName;
    private String shortName;
    private String lastName;
    private String firstName;
    private Collection<? extends GrantedAuthority> grantedAuthorities;

    public UserPrincipal
        (
            long employeeId,
            String fdaEmailAccountName,
            Optional<Long> factsPersonId,
            String password,
            String labGroupName,
            String shortName,
            String lastName,
            String firstName,
            Collection<? extends GrantedAuthority> grantedAuthorities
        )
    {
        Objects.requireNonNull(fdaEmailAccountName, "employee fda email account name is required");
        Objects.requireNonNull(password, "employee password is required");
        Objects.requireNonNull(labGroupName, "employee lab group name is required");
        Objects.requireNonNull(shortName, "employee short name is required");
        Objects.requireNonNull(lastName, "employee last name is required");
        Objects.requireNonNull(firstName, "employee first name is required");

        this.employeeId = employeeId;
        this.fdaEmailAccountName = fdaEmailAccountName;
        this.factsPersonId = factsPersonId;
        this.password = password;
        this.labGroupName = labGroupName;
        this.shortName = shortName;
        this.lastName = lastName;
        this.firstName = firstName;
        this.grantedAuthorities = grantedAuthorities;
    }

    public static UserPrincipal fromEmployeeRecord(Employee emp)
    {
        List<GrantedAuthority> authorities =
            emp.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getName().name()))
            .collect(Collectors.toList());

        return new UserPrincipal(
            emp.getId(),
            emp.getFdaEmailAccountName(),
            Optional.ofNullable(emp.getFactsPersonId()),
            emp.getPassword(),
            emp.getLabGroup().getName(),
            emp.getShortName(),
            emp.getLastName(),
            emp.getFirstName(),
            authorities
        );
    }


    public long getEmployeeId() { return employeeId; }

    public Optional<Long> getFactsPersonId() { return factsPersonId; }

    @Override
    public String getUsername() { return fdaEmailAccountName; }

    @Override
    public String getPassword() { return password; }

    public String getLabGroupName() { return labGroupName; }

    public String getShortName() { return shortName; }

    public String getLastName() { return lastName; }

    public String getFirstName() { return firstName; }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return grantedAuthorities; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal other = (UserPrincipal)o;
        return Objects.equals(employeeId, other.employeeId);
    }

    @Override
    public int hashCode() { return Objects.hash(employeeId); }
}
