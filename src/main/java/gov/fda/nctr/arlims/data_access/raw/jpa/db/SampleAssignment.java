package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(
    name = "SAMPLE_ASSIGNMENT",
    uniqueConstraints = {
        @UniqueConstraint(name="UN_SMPAST_SMPIDEMPID", columnNames = {"SAMPLE_ID", "EMPLOYEE_ID"}),
    },
    indexes = {
        @Index(name = "IX_SMPAST_EMPID", columnList = "EMPLOYEE_ID"),
    }
)
public class SampleAssignment
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPAST_SMP")) @NotNull
    private Sample sample;

    @Column(name = "SAMPLE_ID", insertable = false, updatable = false)
    private Long sampleId;

    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name = "EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_SMPAST_EMP")) @NotNull
    private Employee employee;

    @Column(name = "EMPLOYEE_ID", insertable = false, updatable = false)
    private Long employeeId;

    private LocalDate assignedDate;

    private Boolean lead;

    protected SampleAssignment() {}

    public SampleAssignment
        (
            @NotNull Sample sample,
            @NotNull Employee employee,
            LocalDate assignedDate,
            Boolean lead
        )
    {
        this.sample = sample;
        this.sampleId = sample.getId();
        this.employee = employee;
        this.employeeId = employee.getId();
        this.assignedDate = assignedDate;
        this.lead = lead;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Sample getSample() { return sample; }
    public void setSample(Sample sample) { this.sample = sample; }

    public Long getSampleId() { return sampleId; }
    public void setSampleId(Long sampleId) { this.sampleId = sampleId; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }

    public Boolean getLead() { return lead; }
    public void setLead(Boolean lead) { this.lead = lead; }
}
