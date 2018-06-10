package gov.fda.nctr.arlims.data_access;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import gov.fda.nctr.arlims.models.db.Employee;


public interface EmployeeRepository extends CrudRepository<Employee, Long>
{
    List<Employee> findByUsername(String username);
}
