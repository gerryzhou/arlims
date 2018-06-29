package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


/// Registers a test type as applicable for a lab group, optionally with customization of configuration options for the test type.
@Entity
@Table(
    name = "LAB_GROUP_TEST_TYPE",
    uniqueConstraints = {
        @UniqueConstraint(name="UN_LGRPTSTT_TSTTIDLGRPID", columnNames = {"TEST_TYPE_ID", "LAB_GROUP_ID"}),
    },
    indexes = {
        @Index(name = "IX_LGRPTSTT_LGRPID", columnList = "LAB_GROUP_ID"),
    }
)
public class LabGroupTestType
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_ID", insertable = false, updatable = false)
    private Long labGroupId;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "TEST_TYPE_ID", foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABTESTTYPE")) @NotNull
    private TestType testType;

    @Lob @Basic(fetch = FetchType.LAZY)
    private String testConfigurationJson;

    protected LabGroupTestType() {}

    public LabGroupTestType
        (
            @NotNull LabGroup labGroup,
            @NotNull TestType testType,
            String json
        )
    {
        this.labGroup = labGroup;
        this.labGroupId = labGroup.getId();
        this.testType = testType;
        this.testConfigurationJson = json;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLabGroupId() { return labGroupId; }

    public TestType getTestType() { return testType; }
    public void setTestType(TestType testType) { this.testType = testType; }

    public String getTestConfigurationJson() { return testConfigurationJson; }
    public void setTestConfigurationJson(String json) { this.testConfigurationJson = json; }
}
