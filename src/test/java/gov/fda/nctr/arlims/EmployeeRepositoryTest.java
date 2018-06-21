package gov.fda.nctr.arlims;

import java.util.*;
import javax.inject.Inject;
import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.assertEquals;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import gov.fda.nctr.arlims.data_access.EmployeeRepository;
import gov.fda.nctr.arlims.data_access.LabGroupRepository;
import gov.fda.nctr.arlims.data_access.RoleRepository;
import gov.fda.nctr.arlims.models.db.Employee;
import gov.fda.nctr.arlims.models.db.LabGroup;
import gov.fda.nctr.arlims.models.db.Role;
import gov.fda.nctr.arlims.models.dto.RoleName;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class EmployeeRepositoryTest
{
    @Inject
    private EmployeeRepository employeeRepository;

    @Inject
    private LabGroupRepository labGroupRepository;

    @Inject
    private RoleRepository roleRepository;

    @Before
    public void setUp()
    {
        labGroupRepository.save(
            new LabGroup("ARL-MICRO", null, null, null, "AR",
            null, "Arkansas Regional Laboratories")
        );

        roleRepository.save(new Role(RoleName.USER, "regular user"));
        roleRepository.save(new Role(RoleName.ADMIN, "administrator"));
    }

    @Test @Transactional
    public void testEmployeeSaveAndFetchByName()
    {
        LabGroup labGroup = labGroupRepository.findByName("ARL-MICRO").get();

        Set<Role> roles = new HashSet<>(roleRepository.findAll());

        Employee emp = new Employee("sharris","sch", labGroup, 123L, null,
            "stephen.harris@fda.hhs.gov", "Harris", "Stephen", "C",
            roles
        );
        employeeRepository.save(emp);

        Employee empFetched = employeeRepository.findByUsername("sharris").get();

        assertEquals(empFetched.getUsername(), emp.getUsername());
        assertEquals(empFetched.getFirstName(), emp.getFirstName());
        assertEquals(empFetched.getLastName(), emp.getLastName());
    }
}
