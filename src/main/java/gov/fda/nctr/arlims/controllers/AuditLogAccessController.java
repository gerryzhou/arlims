package gov.fda.nctr.arlims.controllers;

import java.time.*;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.security.AppUserAuthentication;


@RestController
@RequestMapping("/api/audit-log")
public class AuditLogAccessController extends ControllerBase
{
    private final AuditLogService auditLogService;

    public AuditLogAccessController
        (
            AuditLogService auditLogService
        )
    {
        this.auditLogService = auditLogService;
    }

    @GetMapping("entries")
    public List<AuditLogEntry> getAuditLogEntries
        (
            @RequestParam(value="from", required=false) Optional<Instant> fromTimestamp,
            @RequestParam(value="to",   required=false) Optional<Instant> toTimestamp,
            @RequestParam(value="test", required=false) Optional<Long> testId,
            @RequestParam(value="user", required=false) Optional<String> entryUsername,
            @RequestParam(value="data", required=false) Optional<Boolean> includeChangeData,
            @RequestParam(value="unch", required=false) Optional<Boolean> includeUnchangedSaves,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        long labGroupId = currentUser.getLabGroupId();

        return
            auditLogService.getEntries(
                labGroupId,
                testId,
                fromTimestamp,
                toTimestamp,
                entryUsername,
                includeChangeData.orElse(false),
                includeUnchangedSaves.orElse(false)
            );
    }

    @GetMapping("{testId:\\d+}/modifying-employees")
    public List<Long> getTestModifyingEmployees
        (
            @PathVariable long testId
        )
    {
        return auditLogService.getTestModifyingEmployees(testId);
    }

}

