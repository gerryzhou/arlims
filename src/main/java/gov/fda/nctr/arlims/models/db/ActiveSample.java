package gov.fda.nctr.arlims.models.db;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_ACTSMP_LABGRPIDSMPUNITID", columnNames = {"LAB_GROUP_ID", "SAMPLE_UNIT_ID"})
    },
    indexes = {
        @Index(name = "IX_ACTSMP_LABGRPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_ACTSMP_SMPUNITID", columnList = "SAMPLE_UNIT_ID"),
        @Index(name = "IX_ACTSMP_ASSIGNEDTOEMPID", columnList = "ASSIGNED_TO_EMPLOYEE_ID"),
    }
)
public class ActiveSample
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_ACTSMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "SAMPLE_UNIT_ID", foreignKey = @ForeignKey(name="FK_ACTSMP_SAMPLEUNIT")) @NotNull
    private SampleUnit sampleUnit;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ASSIGNED_TO_EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_ACTSMP_EMP")) @Null
    private Employee assignedToEmployee;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "activeSample")
    private List<ActiveSampleUnmanagedResourceUsage> unmanagedResourceUsages = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "activeSample")
    private List<ActiveSampleManagedResourceUsage> managedResourceUsages = new ArrayList<>();


    @Null
    private LocalDate beginDate;

    public ActiveSample
        (
            @NotNull LabGroup labGroup,
            @NotNull SampleUnit sampleUnit,
            @Null Employee assignedToEmployee,
            @Null LocalDate beginDate
        )
    {
        this.labGroup = labGroup;
        this.sampleUnit = sampleUnit;
        this.assignedToEmployee = assignedToEmployee;
        this.beginDate = beginDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public SampleUnit getSampleUnit() { return sampleUnit; }
    public void setSampleUnit(SampleUnit sampleUnit) { this.sampleUnit = sampleUnit; }

    public Employee getAssignedToEmployee() { return assignedToEmployee; }
    public void setAssignedToEmployee(Employee assignedToEmployee) { this.assignedToEmployee = assignedToEmployee; }

    public LocalDate getBeginDate() { return beginDate; }
    public void setBeginDate(LocalDate beginDate) { this.beginDate = beginDate; }

    public List<ActiveSampleUnmanagedResourceUsage> getUnmanagedResourceUsages() { return unmanagedResourceUsages; }
    public void setUnmanagedResourceUsages(List<ActiveSampleUnmanagedResourceUsage> usages) { this.unmanagedResourceUsages = usages; }

    public List<ActiveSampleManagedResourceUsage> getManagedResourceUsages() { return managedResourceUsages; }
    public void setManagedResourceUsages(List<ActiveSampleManagedResourceUsage> usages) { this.managedResourceUsages = usages; }
}
