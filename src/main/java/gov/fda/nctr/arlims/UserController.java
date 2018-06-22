package gov.fda.nctr.arlims;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.fda.nctr.arlims.models.dto.*;


@RestController
@RequestMapping("/api/user")
public class UserController
{
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public UserController()
    {
    }

    @GetMapping("context")
    public UserContext getUserContext
        (
            // TODO: Inject http headers.
        )
    {
        // TODO: Load real user context information from database here.
        AuthenticatedUser user = new AuthenticatedUser(
            1L, "stephen.harris", Optional.of(12345678L), "SH", 1L, "Harris", "Steve",
            Arrays.asList(RoleName.USER, RoleName.ADMIN),
            Instant.now()
        );

        List<LabTestType> testTypes = Arrays.asList(new LabTestType(LabTestTypeCode.IMP_SAL_VIDAS, "Imported Salmonella Vidas", Optional.empty()));

        return new UserContext(user, "ARL-MICRO", testTypes);
    }

}
