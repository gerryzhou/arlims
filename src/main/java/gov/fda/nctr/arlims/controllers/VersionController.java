package gov.fda.nctr.arlims.controllers;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.version_info.AppVersionService;
import gov.fda.nctr.arlims.exceptions.ResourceNotFoundException;
import gov.fda.nctr.arlims.models.dto.AppVersion;


@RestController
@RequestMapping("/api/app-version")
public class VersionController extends ControllerBase
{
    private AppVersionService appVersionService;

    public VersionController(AppVersionService appVersionService)
    {
        this.appVersionService = appVersionService;
    }

    @GetMapping("/")
    public AppVersion getApplicationVersion
        (
            Authentication authentication
        )
    {
        Optional<AppVersion> ver = appVersionService.getAppVersion();

        return ver.orElseThrow(() -> new ResourceNotFoundException("Version information is not available."));
    }

}
