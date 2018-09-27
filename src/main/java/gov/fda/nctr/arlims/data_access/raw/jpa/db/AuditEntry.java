package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_AUDENT_TIMESTAMP", columnList = "TIMESTAMP"),
        @Index(name = "IX_AUDENT_TESTID", columnList = "TEST_ID"),
        @Index(name = "IX_AUDENT_LABGRPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_AUDENT_EMPID", columnList = "ACTING_EMP_ID"),
        @Index(name = "IX_AUDENT_OBJT", columnList = "OBJECT_TYPE"),
    }
)
public class AuditEntry
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TIMESTAMP") @NotNull
    private Instant timestamp;

    @Column(name = "LAB_GROUP_ID") @NotNull
    private Long labGroupId;

    @Column(name = "TEST_ID")
    private Long testId;

    @Column(name = "ACTING_EMP_ID") @NotNull
    private Long actingEmpId;

    @Column(name = "ACTING_USERNAME") @Size(max = 150) @NotNull
    private String actingUsername;

    @Column(name = "ACTION") @Size(max = 50) @NotNull
    private String action;

    @Column(name = "OBJECT_TYPE") @Size(max = 50) @NotNull
    private String objectType;

    @Lob @Column(name = "OBJECT_CONTEXT_METADATA_JSON") // e.g. sample and test metadata
    private String objectContextMetadataJson;

    @Lob @Column(name = "OBJECT_FROM_VALUE_JSON")
    private String objectFromValueJson;

    @Lob @Column(name = "OBJECT_TO_VALUE_JSON")
    private String objectToValueJson;

    protected AuditEntry() {}

    public AuditEntry
        (
            @NotNull Instant timestamp,
            @NotNull Long labGroupId,
            Long testId,
            @NotNull Long actingEmpId,
            @Size(max = 150) @NotNull String actingUsername,
            @Size(max = 50) @NotNull String action,
            @Size(max = 50) @NotNull String objectType,
            String objectContextMetadataJson,
            String objectFromValueJson,
            String objectToValueJson
        )
    {
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public Long getLabGroupId() { return labGroupId; }
    public void setLabGroupId(Long labGroupId) { this.labGroupId = labGroupId; }

    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }

    public Long getActingEmpId() { return actingEmpId; }
    public void setActingEmpId(Long actingEmpId) { this.actingEmpId = actingEmpId; }

    public String getActingUsername() { return actingUsername; }
    public void setActingUsername(String actingUsername) { this.actingUsername = actingUsername; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getObjectType() { return objectType; }
    public void setObjectType(String objectType) { this.objectType = objectType; }

    public String getObjectContextMetadataJson() { return objectContextMetadataJson; }
    public void setObjectContextMetadataJson(String objectContextMetadataJson) { this.objectContextMetadataJson = objectContextMetadataJson; }

    public String getObjectFromValueJson() { return objectFromValueJson; }
    public void setObjectFromValueJson(String objectFromValueJson) { this.objectFromValueJson = objectFromValueJson; }

    public String getObjectToValueJson() { return objectToValueJson; }
    public void setObjectToValueJson(String objectToValueJson) { this.objectToValueJson = objectToValueJson; }
}
