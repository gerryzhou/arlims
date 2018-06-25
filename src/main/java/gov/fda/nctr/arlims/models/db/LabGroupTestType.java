package gov.fda.nctr.arlims.models.db;

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

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "TEST_TYPE_ID", foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABTESTTYPE")) @NotNull
    private TestType testType;

    @Lob @Basic(fetch = FetchType.LAZY)
    private String testOptionsJson;

    protected LabGroupTestType() {}

    public LabGroupTestType
        (
            @NotNull LabGroup labGroup,
            @NotNull TestType testType,
            String json
        )
    {
        this.labGroup = labGroup;
        this.testType = testType;
        this.testOptionsJson = json;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // (LabGroup accessors omitted)

    public TestType getTestType() { return testType; }
    public void setTestType(TestType testType) { this.testType = testType; }

    public String getTestOptionsJson() { return testOptionsJson; }
    public void setTestOptionsJson(String json) { this.testOptionsJson = json; }
}
