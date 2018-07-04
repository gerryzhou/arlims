package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabResourceType;


@Entity
@Table(
    name = "SAMPLE_UNMANAGED_RESOURCE",
    indexes = {
        @Index(name = "IX_SMPUNMRSC_SMPIDEMPIDLSTN", columnList = "SAMPLE_ID, EMPLOYEE_ID, LIST_NAME"),
        @Index(name = "IX_SMPUNMRSC_RSCCD", columnList = "RESOURCE_CODE"),
        @Index(name = "IX_SMPUNMRSC_RSCT", columnList = "RESOURCE_TYPE"),
    }
)
public class SampleUnmanagedResource
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPUNMRSC_SMP")) @NotNull
    private Sample sample;

    @Column(name = "SAMPLE_ID", insertable = false, updatable = false)
    private Long sampleId;

    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name = "EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_SMPUNMRSC_EMP")) @NotNull
    private Employee employee;

    @Column(name = "EMPLOYEE_ID", insertable = false, updatable = false)
    private Long employeeId;

    @Column(name = "LIST_NAME", nullable=false) @Size(max=50) @NotBlank
    private String listName;

    @Column(name = "RESOURCE_CODE", nullable = false) @Size(max = 50) @NotBlank
    private String resourceCode;

    @Enumerated(EnumType.STRING) @Column(name = "RESOURCE_TYPE", length = 60)
    private LabResourceType resourceType;

    protected SampleUnmanagedResource() {}

    public SampleUnmanagedResource
        (
            @NotNull Sample sample,
            @NotNull Employee employee,
            @Size(max = 50) @NotBlank String listName,
            @Size(max = 50) @NotBlank String resourceCode,
            LabResourceType resourceType
        )
    {
        this.sample = sample;
        this.sampleId = sample.getId();
        this.employee = employee;
        this.employeeId = employee.getId();
        this.listName = listName;
        this.resourceCode = resourceCode;
        this.resourceType = resourceType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Sample getSample() { return sample; }
    public void setSample(Sample sample) { this.sample = sample; }

    public Long getSampleId() { return sampleId; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Long getEmployeeId() { return employeeId; }

    public String getListName() { return listName; }
    public void setListName(String listName) { this.listName = listName; }

    public String getResourceCode() { return resourceCode; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }

    public LabResourceType getResourceType() { return resourceType; }
    public void setResourceType(LabResourceType resourceType) { this.resourceType = resourceType; }
}

