package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.Test;


@Repository
public interface TestRepository extends JpaRepository<Test,Long>
{
    List<Test> findBySampleId(long sampleId);
}

