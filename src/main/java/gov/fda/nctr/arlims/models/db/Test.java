package gov.fda.nctr.arlims.models.db;

import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
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
    }
)
public class Test
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_TST_RCVSMP")) @NotNull
    private ReceivedSample sample;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "TEST_TYPE_ID", foreignKey = @ForeignKey(name="FK_TST_TSTT")) @NotNull
    private TestType testType;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_TST_LABGRP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "CREATED") @NotNull
    private Instant created;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "CREATED_BY_EMP_ID", foreignKey = @ForeignKey(name="FK_TST_EMP_CREATED")) @NotNull
    private Employee createdByEmployee;

    @Column(name = "LAST_SAVED") @NotNull
    private Instant lastSaved;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "LAST_SAVED_BY_EMP_ID", foreignKey = @ForeignKey(name="FK_TST_EMP_LASTSAVED")) @NotNull
    private Employee lastSavedByEmployee;

    @Column(name = "BEGIN_DATE") @Null
    private LocalDate beginDate;

    @Size(max = 200) @Null
    private String note;

    @Lob @Basic(fetch = FetchType.LAZY) @Null
    private String testDataJson;

    @Null
    private Instant reviewed;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "REVIEWED_BY_EMP_ID", foreignKey = @ForeignKey(name="FK_TST_EMP_REVIEWED")) @Null
    private Employee reviewedByEmployee;

    @Column(name = "SAVED_TO_FACTS") @Null
    private Instant savedToFacts;

    public Test
        (
            @NotNull ReceivedSample sample,
            @NotNull TestType testType,
            @NotNull LabGroup labGroup,
            @NotNull Instant created,
            @NotNull Employee createdByEmployee,
            @Null LocalDate beginDate,
            @Null @Size(max = 200) String note,
            @Null String testDataJson
        )
    {
        this.sample = sample;
        this.testType = testType;
        this.labGroup = labGroup;
        this.created = created;
        this.createdByEmployee = createdByEmployee;
        this.lastSaved = created;
        this.lastSavedByEmployee = createdByEmployee;
        this.beginDate = beginDate;
        this.note = note;
        this.testDataJson = testDataJson;
        this.reviewed = null;
        this.reviewedByEmployee = null;
        this.savedToFacts = null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReceivedSample getSample() { return sample; }
    public void setSample(ReceivedSample sample) { this.sample = sample; }

    public TestType getTestType() { return testType; }
    public void setTestType(TestType testType) { this.testType = testType; }

    // (LabGroup accessors omitted)

    public Instant getCreated() { return created; }
    public void setCreated(Instant created) { this.created = created; }

    public Employee getCreatedByEmployee() { return createdByEmployee; }
    public void setCreatedByEmployee(Employee createdBy) { this.createdByEmployee = createdBy; }

    public Instant getLastSaved() { return lastSaved; }
    public void setLastSaved(Instant lastSaved) { this.lastSaved = lastSaved; }

    public Employee getLastSavedByEmployee() { return lastSavedByEmployee; }
    public void setLastSavedByEmployee(Employee lastSavedBy) { this.lastSavedByEmployee = lastSavedBy; }

    public LocalDate getBeginDate() { return beginDate; }
    public void setBeginDate(LocalDate beginDate) { this.beginDate = beginDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getTestDataJson() { return testDataJson; }
    public void setTestDataJson(String testDataJson) { this.testDataJson = testDataJson; }

    public Instant getReviewed() { return reviewed; }
    public void setReviewed(Instant reviewed) { this.reviewed = reviewed; }

    public Employee getReviewedByEmployee() { return reviewedByEmployee; }
    public void setReviewedByEmployee(Employee reviewedBy) { this.reviewedByEmployee = reviewedBy; }

    public Instant getSavedToFacts() { return savedToFacts; }
    public void setSavedToFacts(Instant savedToFacts) { this.savedToFacts = savedToFacts; }
}

