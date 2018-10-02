package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.SampleOp;


@Repository
public interface SampleOpRepository extends JpaRepository<SampleOp, Long>
{
    List<SampleOp> findByLabGroupIdAndFactsStatusIn(long labGroupId, List<String> includeStatuses);

    @Query(value = "SELECT so FROM SampleOp so JOIN FETCH so.labGroup where so.factsStatus in :includeStatuses")
    List<SampleOp> findByFactsStatusIn(List<String> includeStatuses);

    @Query(value = "SELECT so FROM SampleOp so JOIN FETCH so.labGroup where so.workId in :workIds")
    List<SampleOp> findByWorkIdIn(Collection<Long> workIds);
}

