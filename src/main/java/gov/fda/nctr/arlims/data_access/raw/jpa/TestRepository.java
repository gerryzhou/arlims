package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.Test;


@Repository
public interface TestRepository extends JpaRepository<Test,Long>
{
    @Query(value = "SELECT t FROM Test t JOIN FETCH t.testType where t.opId in (:opIds)")
    List<Test> findByOpIdIn(@Param("opIds") List<Long> opIds);
}

