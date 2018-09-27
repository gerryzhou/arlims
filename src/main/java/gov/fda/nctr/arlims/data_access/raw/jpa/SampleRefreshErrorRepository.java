package gov.fda.nctr.arlims.data_access.raw.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.SampleRefreshError;


@Repository
public interface SampleRefreshErrorRepository extends JpaRepository<SampleRefreshError,Long>
{
}

