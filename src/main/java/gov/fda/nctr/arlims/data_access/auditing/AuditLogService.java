package gov.fda.nctr.arlims.data_access.auditing;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectWriter;

import gov.fda.nctr.arlims.models.dto.AuditLogEntry;


public interface AuditLogService
{
    long addEntry
        (
            Instant timestamp,
            long labGroupId,
            Optional<Long> testId,
            long empId,
            String username,
            String action,
            String objectType,
            Optional<String> objectContextMetadataJson,
            Optional<String> objectFromValueJson,
            Optional<String> objectToValueJson
        );

    /// For convenience and consistency, callers of addEntry are encouraged to use this ObjectWriter for generating
    /// json data passed to addEntry().
    ObjectWriter getJsonWriter();

    List<AuditLogEntry> getEntries
        (
            long labGroupId,
            Optional<Long> testId,
            Optional<Instant> fromTimestamp,
            Optional<Instant> toTimestamp,
            Optional<String> actingUsername,
            boolean includeChangeData,
            boolean includeUnchangedSaves
        );
}
