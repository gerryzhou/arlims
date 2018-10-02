package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.SampleOpAssignment;


@Repository
public interface SampleOpAssignmentRepository extends JpaRepository<SampleOpAssignment, Long>
{
    List<SampleOpAssignment> findBySampleOpIdIn(List<Long> sampleOpIds);

    @Query(value = "SELECT soa FROM SampleOpAssignment soa JOIN FETCH soa.employee where soa.sampleOpId = :sampleOpId")
    List<SampleOpAssignment> findBySampleOpId(long sampleOpId);

    void deleteBySampleOpIdEquals(Long sampleOpId);
}

