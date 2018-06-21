package gov.fda.nctr.arlims.data_access;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.models.db.LabGroup;


@Repository
public interface LabGroupRepository extends JpaRepository<LabGroup, Long>
{
    Optional<LabGroup> findByName(String name);
}

