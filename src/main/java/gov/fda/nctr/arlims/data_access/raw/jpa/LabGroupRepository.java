package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.LabGroup;


@Repository
public interface LabGroupRepository extends JpaRepository<LabGroup,Long>
{
    @Query(value = "SELECT lg FROM LabGroup lg where lg.id = (select e.labGroup.id from Employee e where e.id = :empId)")
    Optional<LabGroup> findByEmployeeId(@Param("empId") long empId);

    @Query(value = "SELECT lg FROM LabGroup lg where lg.id in (select e.labGroup.id from Employee e where e.factsPersonId in :personIds)")
    List<LabGroup> findByEmployeeFactsPersonIdIn(@Param("personIds") Set<Long> personIds);

    Optional<LabGroup> findByNameAndFactsParentOrgName(String labGroupName, String factsParentOrgName);
}



