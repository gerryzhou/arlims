package gov.fda.nctr.arlims.models.db;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
public class LabTestType
{
    @Id @Size(max = 20) @Column(length = 20)
    private String name;

    @Size(max = 200)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "LAB_TEST_TYPE_SAMPLING_METHOD",
        joinColumns = @JoinColumn(name = "LAB_TEST_TYPE_NAME", foreignKey = @ForeignKey(name="FK_LTSTTSMPMTH_LBTSTT")),
        inverseJoinColumns = @JoinColumn(name = "SAMPLING_METHOD_NAME", foreignKey = @ForeignKey(name="FK_LTSTTSMPMTH_SMPMTH")),
        indexes = {
            @Index(name = "IX_LTSTTSMPMTH_LTSTTNM", columnList = "LAB_TEST_TYPE_NAME"),
            @Index(name = "IX_LTSTTSMPMTH_SMPMTHNM", columnList = "SAMPLING_METHOD_NAME"),
        }
    )
    private List<SamplingMethod> samplingMethods = new ArrayList<>();

    protected LabTestType() {}

    public LabTestType
        (
            @Size(max = 20) @NotBlank String name,
            @Size(max = 200) String description,
            @NotNull List<SamplingMethod> samplingMethods
        )
    {
        this.name = name;
        this.description = description;
        this.samplingMethods = samplingMethods;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public List<SamplingMethod> getSamplingMethods() { return samplingMethods; }

    public void setSamplingMethods(List<SamplingMethod> samplingMethods)
    {
        this.samplingMethods = samplingMethods;
    }
}
