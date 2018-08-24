package gov.fda.nctr.arlims.data_access.raw.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.data_access.raw.jpa.db.Role;


@Repository
public interface RoleRepository extends JpaRepository<Role,Long>
{
    List<Role> findByNameIn(List<String> names);
}


