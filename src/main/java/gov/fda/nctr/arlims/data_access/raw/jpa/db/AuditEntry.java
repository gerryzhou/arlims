package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_AUDENT_TIMESTAMP", columnList = "TIMESTAMP"),
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
}
