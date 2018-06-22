package gov.fda.nctr.arlims.security;

import javax.transaction.Transactional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.EmployeeRepository;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.db.Employee;


@Service
public class AppUserDetailsService implements UserDetailsService
{
    private final EmployeeRepository employeeRepository;

    public AppUserDetailsService(EmployeeRepository employeeRepository)
    {
       this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        Employee emp = employeeRepository.findByFdaEmailAccountName(username).orElseThrow(() ->
            new UsernameNotFoundException("user '" + username + "' not found")
        );

        return UserPrincipal.fromEmployeeRecord(emp);
    }

    @Transactional
    public UserDetails loadUserById(Long id)
    {
        Employee emp = employeeRepository.findById(id).orElseThrow(() ->
            new ResourceNotFoundException("user id " + id)
        );

        return UserPrincipal.fromEmployeeRecord(emp);
    }
}
