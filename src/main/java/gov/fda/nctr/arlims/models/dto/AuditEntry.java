package gov.fda.nctr.arlims.models.dto;

public class AuditEntry
{
    private long entryId;
    private long labGroupId;
    private long actingEmpId;
    private String actingUsername;
    private String action;
    private String objectType;
    private String objectContextMetadataJson;
    private String objectFromValueJson;
    private String objectToValueJson;

    public AuditEntry
        (
            long entryId,
            long labGroupId,
            long actingEmpId,
            String actingUsername,
            String action,
            String objectType,
            String objectContextMetadataJson,
            String objectFromValueJson,
            String objectToValueJson
        )
    {
        this.entryId = entryId;
        this.labGroupId = labGroupId;
        this.actingEmpId = actingEmpId;
        this.actingUsername = actingUsername;
        this.action = action;
        this.objectType = objectType;
        this.objectContextMetadataJson = objectContextMetadataJson;
        this.objectFromValueJson = objectFromValueJson;
        this.objectToValueJson = objectToValueJson;
    }

    public long getEntryId() { return entryId; }

    public long getLabGroupId() { return labGroupId; }

    public long getActingEmpId() { return actingEmpId; }

    public String getActingUsername() { return actingUsername; }

    public String getAction() { return action; }

    public String getObjectType() { return objectType; }

    public String getObjectContextMetadataJson() { return objectContextMetadataJson; }

    public String getObjectFromValueJson() { return objectFromValueJson; }

    public String getObjectToValueJson() { return objectToValueJson; }
}
