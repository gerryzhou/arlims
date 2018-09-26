package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_SMP_LABGRPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_SMP_FACTSSTATUS", columnList = "FACTS_STATUS")
    },
    uniqueConstraints = {
        @UniqueConstraint(name="UN_SMP_WORKID", columnNames = {"WORK_ID"}),
    }
)
public class Sample
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="WORK_ID") @NotNull
    private Long workId; // a.k.a. "work operation id" or "operation id"

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "LAB_GROUP_ID", nullable=false, foreignKey = @ForeignKey(name="FK_SMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_ID", insertable = false, updatable = false, nullable = false)
    private Long labGroupId;

    @Column(name="SAMPLE_TRACKING_NUM") @NotNull
    private Long sampleTrackingNum;

    @Column(name="SAMPLE_TRACKING_SUB_NUM") @NotNull
    private Long sampleTrackingSubNum;

    @Column(name="PAC", nullable = false) @Size(max = 20) @NotBlank
    private String pac;

    @Column(name="LID") @Size(max = 20)
    private String lid;

    @Column(name="PAF") @Size(max = 20)
    private String paf;

    @Size(max = 100) @NotBlank
    private String productName;

    @Size(max = 1)
    private String splitInd;

    @Column(name="FACTS_STATUS", nullable = false) @Size(max = 1) @NotBlank
    private String factsStatus;

    @NotNull
    private Instant factsStatusTimestamp;

    @NotNull
    private Instant lastRefreshedFromFacts;

    @Column(name="SAMPLING_ORG") @Size(max = 30)
    private String samplingOrganization;

    @Column(name="SUBJECT") @Size(max = 4000)
    private String subject;

    @NotNull
    private String operationCode;

    @NotNull
    private Long sampleAnalysisId;

    @NotNull
    private Long workRequestId;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sample")
    private Set<SampleAssignment> assignments = new HashSet<>();

    protected Sample() {}

    public Sample
        (
            @NotNull Long workId,
            @NotNull LabGroup labGroup,
            @NotNull Long sampleTrackingNum,
            @NotNull Long sampleTrackingSubNum,
            @Size(max = 20) @NotBlank String pac,
            @Size(max = 20) String lid,
            @Size(max = 20) String paf,
            @Size(max = 100) @NotBlank String productName,
            @Size(max = 1) String splitInd,
            @NotBlank String factsStatus,
            @NotNull Instant factsStatusTimestamp,
            @NotNull Instant lastRefreshedFromFacts,
            String samplingOrganization,
            String subject,
            @NotNull String operationCode,
            @NotNull Long sampleAnalysisId,
            @NotNull Long workRequestId
        )
    {
        this.workId = workId;
        this.labGroup = labGroup;
        this.labGroupId = labGroup.getId();
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.pac = pac;
        this.lid = lid;
        this.paf = paf;
        this.productName = productName;
        this.splitInd = splitInd;
        this.factsStatus = factsStatus;
        this.factsStatusTimestamp = factsStatusTimestamp;
        this.lastRefreshedFromFacts = lastRefreshedFromFacts;
        this.samplingOrganization = samplingOrganization;
        this.subject = subject;
        this.operationCode = operationCode;
        this.sampleAnalysisId = sampleAnalysisId;
        this.workRequestId = workRequestId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorkId() { return workId; }
    public void setWorkId(Long workId) { this.workId = workId; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public Long getLabGroupId() { return labGroupId; }

    public Long getSampleTrackingNumber() { return sampleTrackingNum; }
    public void setSampleTrackingNumber(Long sampleNum) { this.sampleTrackingNum = sampleNum; }

    public Long getSampleTrackingSubNumber() { return sampleTrackingSubNum; }
    public void setSampleTrackingSubNumber(Long sampleSubNum) { this.sampleTrackingSubNum = sampleSubNum; }

    public String getPac() { return pac; }
    public void setPac(String pacCode) { this.pac= pacCode; }

    public String getLid() { return lid; }
    public void setLid(String lid) { this.lid = lid; }

    public String getPaf() { return paf; }
    public void setPaf(String paf) { this.paf = paf; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getSplitInd() { return splitInd; }
    public void setSplitInd(String splitInd) { this.splitInd = splitInd; }

    public String getFactsStatus() { return factsStatus; }
    public void setFactsStatus(String factsStatus) { this.factsStatus = factsStatus; }

    public Instant getFactsStatusTimestamp() { return factsStatusTimestamp; }
    public void setFactsStatusTimestamp(Instant factsStatusTimestamp) { this.factsStatusTimestamp = factsStatusTimestamp; }

    public Instant getLastRefreshedFromFacts() { return lastRefreshedFromFacts; }
    public void setLastRefreshedFromFacts(Instant lastRefreshedFromFacts) { this.lastRefreshedFromFacts = lastRefreshedFromFacts; }

    public String getSamplingOrganization() { return samplingOrganization; }
    public void setSamplingOrganization(String samplingOrganization) { this.samplingOrganization = samplingOrganization; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getOperationCode() { return operationCode; }
    public void setOperationCode(String operationCode) { this.operationCode = operationCode; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }
    public void setSampleAnalysisId(Long sampleAnalysisId) { this.sampleAnalysisId = sampleAnalysisId; }

    public Long getWorkRequestId() { return workRequestId; }
    public void setWorkRequestId(Long workRequestId) { this.workRequestId = workRequestId; }

    public Set<SampleAssignment> getAssignments() { return assignments; }
    public void setAssignments(Set<SampleAssignment> assignments) { this.assignments = assignments; }
}
