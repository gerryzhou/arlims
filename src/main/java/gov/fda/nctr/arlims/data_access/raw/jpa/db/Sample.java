package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import java.time.LocalDate;
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
        @Index(name = "IX_SMP_RECEIVED", columnList = "RECEIVED"),
        @Index(name = "IX_SMP_FACTSSTATUS", columnList = "FACTS_STATUS")
    }
)
public class Sample
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_SMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_ID", insertable = false, updatable = false)
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

    private LocalDate received;

    @Size(max = 100)
    private String receivedBy;

    @Column(name="FACTS_STATUS", nullable = false) @Size(max = 30) @NotBlank
    private String factsStatus;

    @NotNull
    private LocalDate factsStatusDate;

    @NotNull
    private Instant lastRefreshedFromFacts;

    @Column(name="SAMPLING_ORG") @Size(max = 30)
    private String samplingOrganization;

    @Column(name="SUBJECT") @Size(max = 4000)
    private String subject;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sample")
    private Set<SampleAssignment> assignments = new HashSet<>();

    protected Sample() {}

    public Sample
        (
            @NotNull LabGroup labGroup,
            @NotNull Long sampleTrackingNum,
            @NotNull Long sampleTrackingSubNum,
            @Size(max = 20) @NotBlank String pac,
            @Size(max = 20) String lid,
            @Size(max = 20) String paf,
            @Size(max = 100) @NotBlank String productName,
            @NotNull LocalDate received,
            @Size(max = 100) String receivedBy,
            String factsStatus,
            LocalDate factsStatusDate,
            Instant lastRefreshedFromFacts,
            String samplingOrganization,
            String subject
        )
    {
        this.labGroup = labGroup;
        this.labGroupId = labGroup.getId();
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.pac = pac;
        this.lid = lid;
        this.paf = paf;
        this.productName = productName;
        this.received = received;
        this.receivedBy = receivedBy;
        this.factsStatus = factsStatus;
        this.factsStatusDate = factsStatusDate;
        this.lastRefreshedFromFacts = lastRefreshedFromFacts;
        this.samplingOrganization = samplingOrganization;
        this.subject = subject;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDate getReceived() { return received; }
    public void setReceived(LocalDate received) { this.received = received; }

    public String getReceivedBy() { return receivedBy; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }

    public String getFactsStatus() { return factsStatus; }
    public void setFactsStatus(String factsStatus) { this.factsStatus = factsStatus; }

    public LocalDate getFactsStatusDate() { return factsStatusDate; }
    public void setFactsStatusDate(LocalDate factsStatusDate) { this.factsStatusDate = factsStatusDate; }

    public Instant getLastRefreshedFromFacts() { return lastRefreshedFromFacts; }
    public void setLastRefreshedFromFacts(Instant lastRefreshedFromFacts) { this.lastRefreshedFromFacts = lastRefreshedFromFacts; }

    public String getSamplingOrganization() { return samplingOrganization; }
    public void setSamplingOrganization(String samplingOrganization) { this.samplingOrganization = samplingOrganization; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public Set<SampleAssignment> getAssignments() { return assignments; }
    public void setAssignments(Set<SampleAssignment> assignments) { this.assignments = assignments; }
}
