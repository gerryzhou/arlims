package gov.fda.nctr.arlims.data_access.change_auditing;

import java.time.Instant;
import java.util.Optional;

import com.fasterxml.jackson.databind.ObjectWriter;

public interface DataChangeAuditingService
{
    long logDataChange
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

    /// For convenience and consistency, callers of logDataChange are encouraged to use this ObjectWriter for generating
    /// json data passed to logDataChange().
    ObjectWriter getJsonWriter();
}
