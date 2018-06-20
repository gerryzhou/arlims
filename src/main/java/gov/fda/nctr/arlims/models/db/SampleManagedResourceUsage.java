package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(
    name = "SAMPLE_MANAGED_RESOURCE_USAGE",
    indexes = {
        @Index(name = "IX_SMPMRSCUSG_SMPID", columnList = "SAMPLE_ID"),
        @Index(name = "IX_SMPMRSCUSG_RSCCD", columnList = "RESOURCE_CODE"),
    }
)
public class SampleManagedResourceUsage
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPMRSCUSG_RCVSMP")) @NotNull
    private ReceivedSample sample;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "RESOURCE_CODE", foreignKey = @ForeignKey(name="FK_SMPMRSCUSG_RSC")) @NotNull
    private LabResource labResource;

    @Column(name = "RESOURCE_CODE", insertable = false, updatable = false, nullable = false)
    private String resourceCode;

    public SampleManagedResourceUsage
        (
            @NotNull ReceivedSample sample,
            @NotNull LabResource labResource
        )
    {
        this.sample = sample;
        this.labResource = labResource;
        this.resourceCode = labResource.getCode();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReceivedSample getSample() { return sample; }
    public void setSample(ReceivedSample sample) { this.sample = sample; }

    public LabResource getLabResource() { return labResource; }
    public void setLabResource(LabResource labResource) { this.labResource = labResource; }

    public String getResourceCode() { return resourceCode; }
}
