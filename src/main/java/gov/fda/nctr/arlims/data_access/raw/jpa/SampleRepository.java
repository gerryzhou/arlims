package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.Sample;


@Repository
public interface SampleRepository extends JpaRepository<Sample,Long>
{
    List<Sample> findByLabGroupIdAndFactsStatusIn(long labGroupId, List<String> includeStatuses);

    List<Sample> findByFactsStatusIn(List<String> includeStatuses);

    List<Sample> findByWorkIdIn(Collection<Long> workIds);
}

