package gov.fda.nctr.arlims.data_access;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gov.fda.nctr.arlims.models.db.Role;
import gov.fda.nctr.arlims.models.dto.RoleName;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long>
{
    Optional<Role> findByName(RoleName roleName);
}
