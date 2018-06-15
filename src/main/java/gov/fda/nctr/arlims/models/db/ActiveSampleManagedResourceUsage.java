package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(
    name = "ACT_SMP_MAN_RSC_USG",
    indexes = {
        @Index(name = "IX_ACTSMPMRSCU_ACTSMPID", columnList = "ACTIVE_SAMPLE_ID"),
        @Index(name = "IX_ACTSMPMRSCU_RSCCD", columnList = "RESOURCE_CODE"),
    }
)
public class ActiveSampleManagedResourceUsage
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "ACTIVE_SAMPLE_ID", foreignKey = @ForeignKey(name="FK_ACTSMPMRSCU_ACTSMP")) @NotNull
    private ActiveSample activeSample;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "RESOURCE_CODE", foreignKey = @ForeignKey(name="FK_ACTSMPMRSCU_LABRSC")) @NotNull
    private LabResource labResource;

    public ActiveSampleManagedResourceUsage
        (
            @NotNull ActiveSample activeSample,
            @NotNull LabResource labResource
        )
    {
        this.activeSample = activeSample;
        this.labResource = labResource;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ActiveSample getActiveSample() { return activeSample; }
    public void setActiveSample(ActiveSample activeSample) { this.activeSample = activeSample; }

    public LabResource getLabResource() { return labResource; }
    public void setLabResource(LabResource labResource) { this.labResource = labResource; }
}
