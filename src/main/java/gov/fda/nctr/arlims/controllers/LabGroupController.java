package gov.fda.nctr.arlims.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh.SampleOpRefreshService;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.models.dto.sample_ops_refresh.SampleOpsRefreshResults;
import gov.fda.nctr.arlims.security.AppUserAuthentication;


@RestController
@RequestMapping("/api/lab-group")
public class LabGroupController extends ControllerBase
{
    private final SampleOpRefreshService sampleOpRefreshService;

    public LabGroupController
        (
            SampleOpRefreshService sampleOpRefreshService
        )
    {
        this.sampleOpRefreshService = sampleOpRefreshService;
    }

    @PostMapping("refresh-user-org-sample-ops")
    public SampleOpsRefreshResults refreshSampleOpsOfUserOrg(Authentication authentication)
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        String org = currentUser.getLabGroupFactsParentOrgName();

        log.info("User " + currentUser.getUsername() + " is initiating refresh of samples for organization " + org);

        return sampleOpRefreshService.refreshOrganizationSampleOpsFromFacts(org);
    }
}
