package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.LabResource;


@Repository
public interface LabResourceRepository extends JpaRepository<LabResource,Long>
{
    List<LabResource> findByLabGroupId(long labGroupId);
}

