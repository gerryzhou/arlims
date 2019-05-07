package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Type;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_TST_OPID", columnList = "OP_ID"),
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

    @Column(name = "OP_ID") @NotNull
    private Long opId;

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

    @Lob @Type(type = "org.hibernate.type.TextType") @Basic(fetch = FetchType.LAZY)
    private String testDataJson;

    @Column(name = "TEST_DATA_MD5", length=32, nullable=false)
    private String testDataMd5;

    @Column(length = 4000)
    private String stageStatusesJson;


    // Sample metadata

    @Column(name = "sample_tracking_num") @NotNull
    private Long sampleTrackingNum;

    @Column(name = "sample_tracking_sub_num") @NotNull
    private Long sampleTrackingSubNum;

    @Size(max = 20) @NotNull
    private String pac;

    @Size(max = 500) @NotNull
    private String productName;

    @Size(max = 20)
    private String lid;

    @Size(max = 20)
    private String paf;


    @Size(max = 500)
    private String subject;


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
            @NotNull Long opId,
            @NotNull TestType testType,
            @NotNull LabGroup labGroup,
            @NotNull Instant created,
            @NotNull Employee createdByEmployee,
            LocalDate beginDate,
            @Size(max = 200) String note,
            String testDataJson,
            String testDataMd5,
            String stageStatusesJson,
            @NotNull Long sampleTrackingNum,
            @NotNull Long sampleTrackingSubNum,
            String pac,
            String lid,
            String paf,
            String productName,
            String subject
        )
    {
        this.opId = opId;
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
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.pac = pac;
        this.lid = lid;
        this.paf = paf;
        this.productName = productName;
        this.subject = subject;
        this.reviewed = null;
        this.reviewedByEmployee = null;
        this.reviewedByEmpId = null;
        this.savedToFacts = null;
        this.savedToFactsByEmployee = null;
        this.savedToFactsByEmpId = null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOpId() { return opId; }
    public void setOpId(Long opId) { this.opId = opId; }

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

    public Long getSampleTrackingNum() { return sampleTrackingNum; }
    public void setSampleTrackingNum(Long sampleTrackingNum) { this.sampleTrackingNum = sampleTrackingNum; }

    public Long getSampleTrackingSubNum() { return sampleTrackingSubNum; }
    public void setSampleTrackingSubNum(Long sampleTrackingSubNum) { this.sampleTrackingSubNum = sampleTrackingSubNum; }

    public String getPac() { return pac; }
    public void setPac(String pac) { this.pac = pac; }

    public String getLid() { return lid; }
    public void setLid(String lid) { this.lid = lid; }

    public String getPaf() { return paf; }
    public void setPaf(String paf) { this.paf = paf; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

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

