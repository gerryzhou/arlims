package gov.fda.nctr.arlims.data_access;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.models.db.Employee;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>
{
    Optional<Employee> findByUsername(String username);
}

