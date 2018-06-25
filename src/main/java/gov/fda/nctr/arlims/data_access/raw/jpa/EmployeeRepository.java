package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.Employee;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long>
{
    Optional<Employee> findByFdaEmailAccountName(String username);
}

