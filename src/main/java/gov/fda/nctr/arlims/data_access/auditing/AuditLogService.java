package gov.fda.nctr.arlims.data_access.auditing;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.fasterxml.jackson.databind.ObjectWriter;

import gov.fda.nctr.arlims.models.dto.AuditEntry;


public interface AuditLogService
{
    long addLogEntry
        (
            Instant timestamp,
            long labGroupId,
            long empId,
            String username,
            String action,
            String objectType,
            Optional<String> objectContextMetadataJson,
            Optional<String> objectFromValueJson,
            Optional<String> objectToValueJson
        );

    /// For convenience and consistency, callers of addLogEntry are encouraged to use this ObjectWriter for generating
    /// json data passed to addLogEntry().
    ObjectWriter getJsonWriter();

    List<AuditEntry> getLogEntries
        (
            long labGroupId,
            Instant fromTimestamp,
            Optional<Set<String>> usernames,
            Optional<Set<String>> actions,
            Optional<Set<String>> objectTypes
        );
}
