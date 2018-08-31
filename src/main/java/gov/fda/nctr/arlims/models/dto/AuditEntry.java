package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Optional;

public class AuditEntry
{
    private long entryId;
    private Instant timestamp;
    private long labGroupId;
    private Optional<Long> testId;
    private long actingEmpId;
    private String actingUsername;
    private String action;
    private String objectType;
    private Optional<String> objectContextMetadataJson;
    private Optional<String> objectFromValueJson;
    private Optional<String> objectToValueJson;

    public AuditEntry
        (
            long entryId,
            Instant timestamp,
            long labGroupId,
            Optional<Long> testId,
            long actingEmpId,
            String actingUsername,
            String action,
            String objectType,
            Optional<String> objectContextMetadataJson,
            Optional<String> objectFromValueJson,
            Optional<String> objectToValueJson
        )
    {
        this.entryId = entryId;
        this.timestamp = timestamp;
        this.labGroupId = labGroupId;
        this.testId = testId;
        this.actingEmpId = actingEmpId;
        this.actingUsername = actingUsername;
        this.action = action;
        this.objectType = objectType;
        this.objectContextMetadataJson = objectContextMetadataJson;
        this.objectFromValueJson = objectFromValueJson;
        this.objectToValueJson = objectToValueJson;
    }

    public long getEntryId() { return entryId; }

    public Instant getTimestamp() { return timestamp; }

    public long getLabGroupId() { return labGroupId; }

    public Optional<Long> getTestId() { return testId; }

    public long getActingEmpId() { return actingEmpId; }

    public String getActingUsername() { return actingUsername; }

    public String getAction() { return action; }

    public String getObjectType() { return objectType; }

    public Optional<String> getObjectContextMetadataJson() { return objectContextMetadataJson; }

    public Optional<String> getObjectFromValueJson() { return objectFromValueJson; }

    public Optional<String> getObjectToValueJson() { return objectToValueJson; }
}
