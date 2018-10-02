package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(
    name = "SAMPLE_OP_ASSIGNMENT",
    uniqueConstraints = {
        @UniqueConstraint(name="UN_SMPOPAST_SMPIDEMPID", columnNames = {"SAMPLE_OP_ID", "EMPLOYEE_ID"}),
    },
    indexes = {
        @Index(name = "IX_SAMPOPAST_EMPID", columnList = "EMPLOYEE_ID"),
    }
)
public class SampleOpAssignment
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "SAMPLE_OP_ID", nullable = false, foreignKey = @ForeignKey(name="FK_SAMPOPAST_SMPOP")) @NotNull
    private SampleOp sampleOp;

    @Column(name = "SAMPLE_OP_ID", insertable = false, updatable = false, nullable = false)
    private Long sampleOpId;

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "EMPLOYEE_ID", nullable = false, foreignKey = @ForeignKey(name="FK_SAMPOPAST_EMP")) @NotNull
    private Employee employee;

    @Column(name = "EMPLOYEE_ID", insertable = false, updatable = false, nullable = false)
    private Long employeeId;

    private Instant assignedInstant;

    private Boolean lead;

    protected SampleOpAssignment() {}

    public SampleOpAssignment
        (
            @NotNull SampleOp sampleOp,
            @NotNull Employee employee,
            Instant assignedInstant,
            Boolean lead
        )
    {
        this.sampleOp = sampleOp;
        this.sampleOpId = sampleOp.getId();
        this.employee = employee;
        this.employeeId = employee.getId();
        this.assignedInstant = assignedInstant;
        this.lead = lead;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SampleOp getSampleOp() { return sampleOp; }
    public void setSampleOp(SampleOp sampleOp) { this.sampleOp = sampleOp; }

    public Long getSampleOpId() { return sampleOpId; }
    public void setSampleOpId(Long sampleOpId) { this.sampleOpId = sampleOpId; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Instant getAssignedInstant() { return assignedInstant; }
    public void setAssignedInstant(Instant assignedInstant) { this.assignedInstant = assignedInstant; }

    public Boolean getLead() { return lead; }
    public void setLead(Boolean lead) { this.lead = lead; }
}
