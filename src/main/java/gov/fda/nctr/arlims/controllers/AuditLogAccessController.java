package gov.fda.nctr.arlims.controllers;

import java.time.*;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.security.RolesAllowed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import gov.fda.nctr.arlims.data_access.auditing.AuditLogService;
import gov.fda.nctr.arlims.exceptions.BadRequestException;
import gov.fda.nctr.arlims.models.dto.*;
import gov.fda.nctr.arlims.security.AppUserAuthentication;


@RestController
@RequestMapping("/api/audit-log")
public class AuditLogAccessController
{
    private final AuditLogService auditLogService;

    private final Pattern dateRangeRegex = Pattern.compile("(\\d{4}-\\d{2}-\\d{2})(-(\\d{4}-\\d{2}-\\d{2}))?");

    private final Logger log = LoggerFactory.getLogger(this.getClass());


    public AuditLogAccessController
        (
            AuditLogService auditLogService
        )
    {
        this.auditLogService = auditLogService;
    }

    @GetMapping("entries")
    @RolesAllowed("ROLE_ADMIN")
    public List<AuditEntry> getAuditLogEntries
        (
            @RequestParam(value="date", required=false) Optional<String> dateOrDateRange,
            @RequestParam(value="test", required=false) Optional<Long> testId,
            @RequestParam(value="user", required=false) Optional<String> entryUsername,
            @RequestParam(value="data", required=false) Optional<Boolean> includeChangeData,
            @RequestParam(value="unch", required=false) Optional<Boolean> includeUnchangedSaves,
            Authentication authentication
        )
    {
        AppUser currentUser = ((AppUserAuthentication)authentication).getAppUser();

        long labGroupId = currentUser.getLabGroupId();

        Optional<Instant[]> timestamps = dateOrDateRange.map(datesStr -> {
            Matcher datesMatcher = dateRangeRegex.matcher(datesStr);
            if ( datesMatcher.matches() )
            {
                Instant from = dateStringToInstant(datesMatcher.group(1));
                if ( datesMatcher.group(2) == null ) return new Instant[]{from};
                else return new Instant[]{from, dateStringToInstant(datesMatcher.group(3))};
            }
            else
                throw new BadRequestException("Invalid date or date range entered.");
        });

        Optional<Instant> fromTimestamp = timestamps.map(ts -> ts[0]);
        Optional<Instant> toTimestamp = timestamps.flatMap(ts -> ts.length == 2 ? Optional.of(ts[1]): Optional.empty());

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

    private Instant dateStringToInstant(String dateString)
    {
        return
            LocalDate.parse(dateString)
            .atStartOfDay()
            .atZone(ZoneId.systemDefault()).toInstant();

    }

}

