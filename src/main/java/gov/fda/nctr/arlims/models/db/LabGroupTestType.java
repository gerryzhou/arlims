package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(
    indexes = {
        @Index(name = "IX_LGRPTSTT_LGRPID", columnList = "LAB_GROUP_ID"),
    },
    uniqueConstraints = {
        @UniqueConstraint(name="UN_LGRPTSTT_LGRPIDTSTTID", columnNames = {"TEST_TYPE_ID", "LAB_GROUP_ID"}),
    }
)
public class LabGroupTestType
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "TEST_TYPE_ID", foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABTESTTYPE")) @NotNull
    private LabTestType testType;

    @Lob @Basic(fetch = FetchType.LAZY)
    private String testOptionsJson;

    public LabGroupTestType
        (
            @NotNull LabGroup labGroup,
            @NotNull LabTestType testType,
            String json
        )
    {
        this.labGroup = labGroup;
        this.testType = testType;
        this.testOptionsJson = json;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public LabTestType getTestType() { return testType; }
    public void setTestType(LabTestType testType) { this.testType = testType; }

    public String getTestOptionsJson() { return testOptionsJson; }
    public void setTestOptionsJson(String json) { this.testOptionsJson = json; }
}
