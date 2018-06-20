package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabResourceType;


@Entity
@Table(
    name = "SAMPLE_UNMANGD_RESOURCE_USAGE",
    indexes = {
        @Index(name = "IX_SMPUNMRSCUSG_SMPID", columnList = "SAMPLE_ID"),
        @Index(name = "IX_SMPUNMRSCUSG_RSCCD", columnList = "RESOURCE_CODE"),
        @Index(name = "IX_SMPUNMRSCUSG_RSCT", columnList = "RESOURCE_TYPE"),
    }
)
public class SampleUnmanagedResourceUsage
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPUNMRSCUSG_RCVSMP")) @NotNull
    private ReceivedSample sample;

    @Column(name = "RESOURCE_CODE", length = 50, nullable = false) @Size(max = 50) @NotEmpty
    private String resourceCode;

    @Enumerated(EnumType.STRING) @Column(name = "RESOURCE_TYPE", length = 60) @Null
    private LabResourceType resourceType;


    public SampleUnmanagedResourceUsage
        (
            @NotNull ReceivedSample sample,
            @Size(max = 50) @NotEmpty String resourceCode,
            @Null LabResourceType resourceType
        )
    {
        this.sample = sample;
        this.resourceCode = resourceCode;
        this.resourceType = resourceType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReceivedSample getSample() { return sample; }
    public void setSample(ReceivedSample sample) { this.sample = sample; }

    public String getResourceCode() { return resourceCode; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }

    public LabResourceType getResourceType() { return resourceType; }
    public void setResourceType(LabResourceType resourceType) { this.resourceType = resourceType; }
}
