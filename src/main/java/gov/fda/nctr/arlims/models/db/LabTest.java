package gov.fda.nctr.arlims.models.db;

import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_LABTST_SMPUNTID", columnList = "SAMPLE_UNIT_ID"),
        @Index(name = "IX_LABTST_LABGRPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_LABTST_TESTTYPEID", columnList = "TEST_TYPE_ID"),
        @Index(name = "IX_LABTST_SAVEDBYEMPID", columnList = "SAVED_BY_EMPLOYEE_ID"),
        @Index(name = "IX_LABTST_REVIEWEDBYEMPID", columnList = "REVIEWED_BY_EMPLOYEE_ID"),
        @Index(name = "IX_LABTST_SAVEDTOFACTS", columnList = "SAVED_TO_FACTS"),
    }
)
public class LabTest
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "SAMPLE_UNIT_ID", foreignKey = @ForeignKey(name="FK_LABTST_SAMPLEUNIT")) @NotNull
    private SampleUnit sampleUnit;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "TEST_TYPE_ID", foreignKey = @ForeignKey(name="FK_LABTST_LABTESTTYPE")) @NotNull
    private LabTestType testType;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_LABTST_LABGROUP")) @NotNull
    private LabGroup labGroup;

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

    @Column(name = "SAVED_TO_FACTS")
    private Instant savedToFacts;

    public LabTest
        (
            @NotNull SampleUnit sampleUnit,
            @NotNull LabTestType testType,
            @NotNull LabGroup labGroup,
            LocalDate beginDate,
            String testDataJson,
            @Size(max = 200) String note,
            @NotNull Instant saved,
            @NotNull Employee savedBy,
            Instant reviewed,
            Employee reviewedBy
        )
    {
        this.sampleUnit = sampleUnit;
        this.testType = testType;
        this.labGroup = labGroup;
        this.beginDate = beginDate;
        this.testDataJson = testDataJson;
        this.note = note;
        this.saved = saved;
        this.savedBy = savedBy;
        this.reviewed = reviewed;
        this.reviewedBy = reviewedBy;
        this.savedToFacts = null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SampleUnit getSampleUnit() { return sampleUnit; }
    public void setSampleUnit(SampleUnit sampleUnit) { this.sampleUnit = sampleUnit; }

    public LabTestType getTestType() { return testType; }
    public void setTestType(LabTestType testType) { this.testType = testType; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

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

    public Instant getSavedToFacts() { return savedToFacts; }
    public void setSavedToFacts(Instant savedToFacts) { this.savedToFacts = savedToFacts; }
}

