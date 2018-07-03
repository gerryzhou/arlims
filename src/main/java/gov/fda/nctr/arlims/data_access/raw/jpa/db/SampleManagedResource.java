package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    name = "SAMPLE_MANAGED_RESOURCE",
    indexes = {
        @Index(name = "IX_SMPMANRSC_SMPIDEMPIDLSTN", columnList = "SAMPLE_ID, EMPLOYEE_ID, LIST_NAME"),
        @Index(name = "IX_SMPMANRSC_RSCCD", columnList = "RESOURCE_CODE"),
    }
)
public class SampleManagedResource
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPMANRSC_SMP")) @NotNull
    private Sample sample;

    @Column(name = "SAMPLE_ID", insertable = false, updatable = false)
    private Long sampleId;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_SMPMANRSC_EMP")) @NotNull
    private Employee employee;

    @Column(name = "EMPLOYEE_ID", insertable = false, updatable = false)
    private Long employeeId;

    @Column(name = "LIST_NAME", nullable=false) @Size(max=50) @NotBlank
    private String listName;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "RESOURCE_CODE", foreignKey = @ForeignKey(name="FK_SMPMANRSC_LABRSC")) @NotNull
    private LabResource labResource;

    @Column(name = "RESOURCE_CODE", insertable = false, updatable = false)
    private String resourceCode;

    protected SampleManagedResource() {}

    public SampleManagedResource
        (
            @NotNull Sample sample,
            @NotNull Employee employee,
            @Size(max = 50) @NotBlank String listName,
            @NotNull LabResource labResource
        )
    {
        this.sample = sample;
        this.sampleId = sample.getId();
        this.employee = employee;
        this.employeeId = employee.getId();
        this.listName = listName;
        this.labResource = labResource;
        this.resourceCode = labResource.getCode();
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

    public LabResource getLabResource() { return labResource; }
    public void setLabResource(LabResource labResource) { this.labResource = labResource; }

    public String getResourceCode() { return resourceCode; }
}

