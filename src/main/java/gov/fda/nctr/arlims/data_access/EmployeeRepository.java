package gov.fda.nctr.arlims.data_access;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import gov.fda.nctr.arlims.data_access.entities.EmployeeRecord;


public interface EmployeeRepository extends CrudRepository<EmployeeRecord, Long>
{
    List<EmployeeRecord> findByUsername(String username);
}
