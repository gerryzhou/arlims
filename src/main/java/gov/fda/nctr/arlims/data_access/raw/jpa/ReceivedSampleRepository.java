package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.ReceivedSample;


@Repository
public interface ReceivedSampleRepository extends JpaRepository<ReceivedSample,Long>
{
    List<ReceivedSample> findByLabGroupIdAndActive(long labGroupId, boolean active);
}

