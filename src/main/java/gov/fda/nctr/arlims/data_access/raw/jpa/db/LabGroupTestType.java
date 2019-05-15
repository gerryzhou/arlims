package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Type;


/// Registers a test type as applicable for a lab group, optionally with customization of configuration options for the test type.
@Entity
@Table(
    name = "LAB_GROUP_TEST_TYPE",
    indexes = {
        @Index(name = "IX_LGRPTSTT_TSTTID", columnList = "TEST_TYPE_ID"),
    }
)
@IdClass(LabGroupTestTypeKey.class)
public class LabGroupTestType
{
    @Id @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "LAB_GROUP_ID", nullable = false, foreignKey = @ForeignKey(name="FK_LGRPTSTT_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Id @ManyToOne(fetch = FetchType.EAGER, optional=false)
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

    public TestType getTestType() { return testType; }
    public void setTestType(TestType testType) { this.testType = testType; }

    public String getTestConfigurationJson() { return testConfigurationJson; }
    public void setTestConfigurationJson(String json) { this.testConfigurationJson = json; }

    public String getReportNamesBarSeparated() { return reportNamesBarSep; }
    public void setReportNamesBarSeparated(String reportNamesBarSep) { this.reportNamesBarSep = reportNamesBarSep; }
}

class LabGroupTestTypeKey implements Serializable
{
    private LabGroup labGroup;
    private TestType testType;

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LabGroupTestTypeKey that = (LabGroupTestTypeKey) o;
        return labGroup.equals(that.labGroup) &&
        testType.equals(that.testType);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(labGroup, testType);
    }
}