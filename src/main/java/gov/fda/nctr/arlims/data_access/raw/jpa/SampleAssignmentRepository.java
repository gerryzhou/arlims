package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.SampleAssignment;


@Repository
public interface SampleAssignmentRepository extends JpaRepository<SampleAssignment,Long>
{
    List<SampleAssignment> findBySampleIdIn(List<Long> sampleIds);
}

