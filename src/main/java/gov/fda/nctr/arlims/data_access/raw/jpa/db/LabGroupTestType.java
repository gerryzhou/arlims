package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Type;


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

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "LAB_GROUP_ID", nullable = false, foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @ManyToOne(fetch = FetchType.EAGER, optional=false)
    @JoinColumn(name = "TEST_TYPE_ID", nullable = false, foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABTESTTYPE")) @NotNull
    private TestType testType;

    @Lob @Type(type = "org.hibernate.type.TextType") @Basic(fetch = FetchType.LAZY)
    private String testConfigurationJson;

    @Column(length=4000)
    private String reportNamesBarSep;

    protected LabGroupTestType() {}

    public LabGroupTestType
        (
            @NotNull LabGroup labGroup,
            @NotNull TestType testType,
            String testConfigurationJson,
            String reportNamesBarSep
        )
    {
        this.labGroup = labGroup;
        this.testType = testType;
        this.testConfigurationJson = testConfigurationJson;
        this.reportNamesBarSep = reportNamesBarSep;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TestType getTestType() { return testType; }
    public void setTestType(TestType testType) { this.testType = testType; }

    public String getTestConfigurationJson() { return testConfigurationJson; }
    public void setTestConfigurationJson(String json) { this.testConfigurationJson = json; }

    public String getReportNamesBarSeparated() { return reportNamesBarSep; }
    public void setReportNamesBarSeparated(String reportNamesBarSep) { this.reportNamesBarSep = reportNamesBarSep; }
}
