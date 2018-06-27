package gov.fda.nctr.arlims.data_access.raw.jpa.db;

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
        @Index(name = "IX_RCVSMP_LABGRPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_RCVSMP_SMPNUMPACCD", columnList = "SAMPLE_NUM,PAC_CODE"),
        @Index(name = "IX_RCVSMP_RECEIVED", columnList = "RECEIVED"),
        @Index(name = "IX_RCVSMP_TESTBEGINDATE", columnList = "TEST_BEGIN_DATE"),
    }
)
public class ReceivedSample
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="SAMPLE_NUM") @NotNull
    private Long sampleNum;

    @Column(name="PAC_CODE", nullable = false) @Size(max = 20) @NotBlank
    private String pacCode;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_RCVSMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_ID", insertable = false, updatable = false)
    private Long labGroupId;

    private boolean active = false;

    @Size(max = 100) @NotBlank
    private String productName;

    @NotNull
    private LocalDate received;

    @Size(max = 100)
    private String receivedBy;

    @Column(name = "TEST_BEGIN_DATE")
    private LocalDate testBeginDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "SAMPLE_EMPLOYEE_ASSIGNMENT",
        joinColumns = @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPEMPAST_RCVSMP")),
        inverseJoinColumns = @JoinColumn(name = "EMP_ID", foreignKey = @ForeignKey(name="FK_SMPEMPAST_EMP")),
        indexes = {
            @Index(name = "IX_SMPEMPAST_SMPID", columnList = "SAMPLE_ID"),
            @Index(name = "IX_SMPEMPAST_EMPID", columnList = "EMP_ID"),
        }
    )
    private Set<Employee> assignedToEmployees = new HashSet<>();


    protected ReceivedSample() {}

    public ReceivedSample
        (
            @NotNull Long sampleNum,
            @Size(max = 20) @NotBlank String pacCode,
            @NotNull LabGroup labGroup,
            boolean active,
            @Size(max = 100) @NotBlank String productName,
            @NotNull LocalDate received,
            @Size(max = 100) String receivedBy,
            LocalDate testBeginDate,
            @NotNull Set<Employee> assignedToEmployees
        )
    {
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.labGroup = labGroup;
        this.labGroupId = labGroup.getId();
        this.active = active;
        this.productName = productName;
        this.received = received;
        this.receivedBy = receivedBy;
        this.testBeginDate = testBeginDate;
        this.assignedToEmployees = assignedToEmployees;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSampleNumber() { return sampleNum; }
    public void setSampleNumber(Long sampleNum) { this.sampleNum = sampleNum; }

    public String getPacCode() { return pacCode; }
    public void setPacCode(String pacCode) { this.pacCode = pacCode; }

    public Long getLabGroupId() { return labGroupId; }

    public boolean getActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public LocalDate getReceived() { return received; }
    public void setReceived(LocalDate received) { this.received = received; }

    public String getReceivedBy() { return receivedBy; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }

    public LocalDate getTestBeginDate() { return testBeginDate; }
    public void setTestBeginDate(LocalDate testBeginDate) { this.testBeginDate = testBeginDate; }

    public Set<Employee> getAssignedToEmployees() { return assignedToEmployees; }
    public void setAssignedToEmployees(Set<Employee> emps) { this.assignedToEmployees = emps; }
}
