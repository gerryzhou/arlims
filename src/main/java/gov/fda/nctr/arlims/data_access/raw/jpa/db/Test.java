package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_TST_SMPID", columnList = "SAMPLE_ID"),
        @Index(name = "IX_TST_TESTTYPEID", columnList = "TEST_TYPE_ID"),
        @Index(name = "IX_TST_LABGRPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_TST_CREATED", columnList = "CREATED"),
        @Index(name = "IX_TST_CREATEDEMPID", columnList = "CREATED_BY_EMP_ID"),
        @Index(name = "IX_TST_LASTSAVED", columnList = "LAST_SAVED"),
        @Index(name = "IX_TST_LASTSAVEDEMPID", columnList = "LAST_SAVED_BY_EMP_ID"),
        @Index(name = "IX_TST_BEGINDATE", columnList = "BEGIN_DATE"),
        @Index(name = "IX_TST_REVIEWEDEMPID", columnList = "REVIEWED_BY_EMP_ID"),
        @Index(name = "IX_TST_SAVEDTOFACTS", columnList = "SAVED_TO_FACTS"),
        @Index(name = "IX_TST_SAVEDTOFACTSEMPID", columnList = "SAVED_TO_FACTS_BY_EMP_ID"),
        @Index(name = "IX_TST_TESTDATAMD5", columnList = "TEST_DATA_MD5"),
    }
)
public class Test
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "SAMPLE_ID", nullable = false, foreignKey = @ForeignKey(name="FK_TST_RCVSMP")) @NotNull
    private Sample sample;

    @Column(name = "SAMPLE_ID", insertable = false, updatable = false, nullable = false)
    private Long sampleId;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "TEST_TYPE_ID", nullable = false, foreignKey = @ForeignKey(name="FK_TST_TSTT")) @NotNull
    private TestType testType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "LAB_GROUP_ID", nullable = false, foreignKey = @ForeignKey(name="FK_TST_LABGRP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_ID", insertable = false, updatable = false, nullable = false)
    private Long labGroupId;

    @Column(name = "CREATED") @NotNull
    private Instant created;

    @ManyToOne(fetch = FetchType.EAGER, optional=false)
    @JoinColumn(name = "CREATED_BY_EMP_ID", nullable = false, foreignKey = @ForeignKey(name="FK_TST_EMP_CREATED")) @NotNull
    private Employee createdByEmployee;

    @Column(name = "CREATED_BY_EMP_ID", insertable = false, updatable = false, nullable = false)
    private Long createdByEmpId;

    @Column(name = "LAST_SAVED") @NotNull
    private Instant lastSaved;

    @ManyToOne(fetch = FetchType.EAGER, optional=false)
    @JoinColumn(name = "LAST_SAVED_BY_EMP_ID", nullable = false, foreignKey = @ForeignKey(name="FK_TST_EMP_LASTSAVED")) @NotNull
    private Employee lastSavedByEmployee;

    @Column(name = "LAST_SAVED_BY_EMP_ID", insertable = false, updatable = false, nullable = false)
    private Long lastSavedByEmpId;

    @Column(name = "BEGIN_DATE")
    private LocalDate beginDate;

    @Size(max = 200)
    private String note;

    @Lob @Basic(fetch = FetchType.LAZY)
    private String testDataJson;

    @Column(name = "TEST_DATA_MD5", length=32, nullable=false)
    private String testDataMd5;

    @Column(length = 4000)
    private String stageStatusesJson;

    private Instant reviewed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REVIEWED_BY_EMP_ID", foreignKey = @ForeignKey(name="FK_TST_EMP_REVIEWED"))
    private Employee reviewedByEmployee;

    @Column(name = "REVIEWED_BY_EMP_ID", insertable = false, updatable = false)
    private Long reviewedByEmpId;

    @Column(name = "SAVED_TO_FACTS")
    private Instant savedToFacts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SAVED_TO_FACTS_BY_EMP_ID", foreignKey = @ForeignKey(name="FK_TST_EMP_SAVEDTOFACTS"))
    private Employee savedToFactsByEmployee;

    @Column(name = "SAVED_TO_FACTS_BY_EMP_ID", insertable = false, updatable = false)
    private Long savedToFactsByEmpId;

    protected Test() {}

    public Test
        (
            @NotNull Sample sample,
            @NotNull TestType testType,
            @NotNull LabGroup labGroup,
            @NotNull Instant created,
            @NotNull Employee createdByEmployee,
            LocalDate beginDate,
            @Size(max = 200) String note,
            String testDataJson,
            String testDataMd5,
            String stageStatusesJson
        )
    {
        this.sample = sample;
        this.sampleId = sample.getId();
        this.testType = testType;
        this.labGroup = labGroup;
        this.labGroupId = labGroup.getId();
        this.created = created;
        this.createdByEmployee = createdByEmployee;
        this.createdByEmpId = createdByEmployee.getId();
        this.lastSaved = created; // initially last saved attributes are those of the creation
        this.lastSavedByEmployee = createdByEmployee;
        this.lastSavedByEmpId = createdByEmployee.getId();
        this.beginDate = beginDate;
        this.note = note;
        this.testDataJson = testDataJson;
        this.testDataMd5 = testDataMd5;
        this.stageStatusesJson = stageStatusesJson;
        this.reviewed = null;
        this.reviewedByEmployee = null;
        this.reviewedByEmpId = null;
        this.savedToFacts = null;
        this.savedToFactsByEmployee = null;
        this.savedToFactsByEmpId = null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Sample getSample() { return sample; }
    public void setSample(Sample sample) { this.sample = sample; }

    public Long getSampleId() { return sampleId; }

    public TestType getTestType() { return testType; }
    public void setTestType(TestType testType) { this.testType = testType; }

    public Long getLabGroupId() { return labGroupId; }

    public Instant getCreated() { return created; }
    public void setCreated(Instant created) { this.created = created; }

    public Employee getCreatedByEmployee() { return createdByEmployee; }
    public void setCreatedByEmployee(Employee createdBy) { this.createdByEmployee = createdBy; }

    public Long getCreatedByEmpId() { return createdByEmpId; }

    public Instant getLastSaved() { return lastSaved; }
    public void setLastSaved(Instant lastSaved) { this.lastSaved = lastSaved; }

    public Employee getLastSavedByEmployee() { return lastSavedByEmployee; }
    public void setLastSavedByEmployee(Employee lastSavedBy) { this.lastSavedByEmployee = lastSavedBy; }

    public Long getLastSavedByEmpId() { return lastSavedByEmpId; }

    public LocalDate getBeginDate() { return beginDate; }
    public void setBeginDate(LocalDate beginDate) { this.beginDate = beginDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getTestDataJson() { return testDataJson; }
    public void setTestDataJson(String testDataJson) { this.testDataJson = testDataJson; }

    public String getTestDataMd5() { return testDataMd5; }
    public void setTestDataMd5(String testDataMd5) { this.testDataMd5 = testDataMd5; }

    public String getStageStatusesJson() { return stageStatusesJson; }
    public void setStageStatusesJson(String stageStatusesJson) { this.stageStatusesJson = stageStatusesJson; }

    public Instant getReviewed() { return reviewed; }
    public void setReviewed(Instant reviewed) { this.reviewed = reviewed; }

    public Employee getReviewedByEmployee() { return reviewedByEmployee; }
    public void setReviewedByEmployee(Employee reviewedBy) { this.reviewedByEmployee = reviewedBy; }

    public Long getReviewedByEmpId() { return reviewedByEmpId; }

    public Instant getSavedToFacts() { return savedToFacts; }
    public void setSavedToFacts(Instant savedToFacts) { this.savedToFacts = savedToFacts; }

    public Employee getSavedToFactsByEmployee() { return savedToFactsByEmployee; }
    public void setSavedToFactsByEmployee(Employee savedToFactsBy) { this.savedToFactsByEmployee = savedToFactsBy; }

    public Long getSavedToFactsByEmpId() { return savedToFactsByEmpId; }
}

