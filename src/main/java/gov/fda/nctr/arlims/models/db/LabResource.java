package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabResourceType;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_LABRSC_LABGRPID", columnList = "LAB_GROUP_ID"),
    }
)
public class LabResource
{
    @Id @Column(length = 50) @Size(max = 50)
    private String code;

    @Enumerated(EnumType.STRING) @Column(length = 60) @NotNull
    private LabResourceType resourceType;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_LABRSC_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Size(max = 100)
    private String description;

    public LabResource
        (
            @NotBlank @Size(max = 50) String code,
            @NotNull LabResourceType resourceType,
            @NotNull LabGroup labGroup,
            @Null @Size(max = 100) String description
        )
    {
        this.code = code;
        this.resourceType = resourceType;
        this.labGroup = labGroup;
        this.description = description;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public LabResourceType getLabResourceType() { return resourceType; }
    public void setLabResourceType(LabResourceType resourceType) { this.resourceType = resourceType; }

    // (LabGroup accessors omitted)

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
