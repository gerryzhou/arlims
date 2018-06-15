package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabResourceType;


@Entity
@Table(
    name = "ACT_SMP_UNMAN_RSC_USG",
    indexes = {
        @Index(name = "IX_ACTSMPURSCU_ACTSMPID", columnList = "ACTIVE_SAMPLE_ID"),
        @Index(name = "IX_ACTSMPURSCU_RSCCD", columnList = "RESOURCE_CODE"),
        @Index(name = "IX_ACTSMPURSCU_RSCT", columnList = "RESOURCE_TYPE"),
    }
)
public class ActiveSampleUnmanagedResourceUsage
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "ACTIVE_SAMPLE_ID", foreignKey = @ForeignKey(name="FK_ACTSMPURSCU_ACTSMP")) @NotNull
    private ActiveSample activeSample;

    @Column(name = "RESOURCE_CODE", length = 50) @Size(max = 50)
    private String resourceCode;

    @Enumerated(EnumType.STRING) @Column(name = "RESOURCE_TYPE", length = 60) @Null
    private LabResourceType resourceType;


    public ActiveSampleUnmanagedResourceUsage
        (
            @NotNull ActiveSample activeSample,
            @Size(max = 50) String resourceCode,
            @Null LabResourceType resourceType
        )
    {
        this.activeSample = activeSample;
        this.resourceCode = resourceCode;
        this.resourceType = resourceType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ActiveSample getActiveSample() { return activeSample; }
    public void setActiveSample(ActiveSample activeSample) { this.activeSample = activeSample; }

    public String getResourceCode() { return resourceCode; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }

    public LabResourceType getResourceType() { return resourceType; }
    public void setResourceType(LabResourceType resourceType) { this.resourceType = resourceType; }
}
