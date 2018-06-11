package gov.fda.nctr.arlims.models.db;

import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_LABTST_SAMPLEUNIT", columnList = "SAMPLE_UNIT_ID"),
        @Index(name = "IX_LABTST_LABGROUP", columnList = "LAB_GROUP_NAME"),
        @Index(name = "IX_LABTST_TESTTYPE", columnList = "TEST_TYPE_NAME"),
        @Index(name = "IX_LABTST_SAVEDBYEMP", columnList = "SAVED_BY_EMPLOYEE_ID"),
        @Index(name = "IX_LABTST_REVIEWEDBYEMP", columnList = "REVIEWED_BY_EMPLOYEE_ID"),
    }
)
public class LabTest
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "SAMPLE_UNIT_ID", foreignKey = @ForeignKey(name="FK_LABTST_SAMPLEUNIT")) @NotNull
    private SampleUnit sampleUnit;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_NAME", foreignKey = @ForeignKey(name="FK_LABTST_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_NAME", insertable = false, updatable = false, nullable = false)
    private String labGroupName;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "TEST_TYPE_NAME", foreignKey = @ForeignKey(name="FK_LABTST_LABTESTTYPE")) @NotNull
    private LabTestType testType;

    @Column(name = "TEST_TYPE_NAME", insertable = false, updatable = false, nullable = false)
    private String testTypeName;

    private LocalDate beginDate;

    @Lob @Basic(fetch = FetchType.LAZY)
    private String testDataJson;

    @Size(max = 200)
    private String note;

    @NotNull
    private Instant saved;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "SAVED_BY_EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_LABTST_EMP_SAVEDBY")) @NotNull
    private Employee savedBy;

    @Column(name = "SAVED_BY_EMPLOYEE_ID", insertable = false, updatable = false, nullable = false)
    private Long savedByEmployeeId;

    private Instant reviewed;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "REVIEWED_BY_EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_LABTST_EMP_REVBY"))
    private Employee reviewedBy;

    @Column(name = "REVIEWED_BY_EMPLOYEE_ID", insertable = false, updatable = false)
    private Long reviewedByEmployeeId;

    public LabTest
        (
            @NotNull SampleUnit sampleUnit,
            @NotNull LabGroup labGroup,
            @NotNull LabTestType labTestType,
            LocalDate beginDate,
            String testDataJson,
            @Size(max = 200) String note,
            Instant saved,
            Employee savedBy,
            Instant reviewed,
            Employee reviewedBy
        )
    {
        this.sampleUnit = sampleUnit;
        this.labGroup = labGroup;
        this.labGroupName = labGroup.getName();
        this.testType = labTestType;
        this.testTypeName = testType.getName().toString();
        this.beginDate = beginDate;
        this.testDataJson = testDataJson;
        this.note = note;
        this.saved = saved;
        this.savedBy = savedBy;
        this.reviewed = reviewed;
        this.reviewedBy = reviewedBy;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public SampleUnit getSampleUnit() { return sampleUnit; }

    public void setSampleUnit(SampleUnit sampleUnit) { this.sampleUnit = sampleUnit; }

    public LabGroup getLabGroup() { return labGroup; }

    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public String getLabGroupName() { return labGroupName; }

    public LabTestType getTestType() { return testType; }

    public void setTestType(LabTestType testType) { this.testType = testType; }

    public String getTestTypeName() { return testTypeName; }

    public LocalDate getBeginDate() { return beginDate; }

    public void setBeginDate(LocalDate beginDate) { this.beginDate = beginDate; }

    public String getTestDataJson() { return testDataJson; }

    public void setTestDataJson(String testDataJson) { this.testDataJson = testDataJson; }

    public String getNote() { return note; }

    public void setNote(String note) { this.note = note; }

    public Instant getSaved() { return saved; }

    public void setSaved(Instant saved) { this.saved = saved; }

    public Employee getSavedBy() { return savedBy; }

    public void setSavedBy(Employee savedBy) { this.savedBy = savedBy; }

    public Long getSavedByEmployeeId() { return savedByEmployeeId; }

    public Instant getReviewed() { return reviewed; }

    public void setReviewed(Instant reviewed) { this.reviewed = reviewed; }

    public Employee getReviewedBy() { return reviewedBy; }

    public void setReviewedBy(Employee reviewedBy) { this.reviewedBy = reviewedBy; }

    public Long getReviewedByEmployeeId() { return reviewedByEmployeeId; }
}

