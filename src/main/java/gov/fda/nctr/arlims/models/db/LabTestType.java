package gov.fda.nctr.arlims.models.db;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_LABTSTT_CODE", columnNames = {"CODE"}),
    }
)
public class LabTestType
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) @Column(length = 50) @NotNull
    private LabTestTypeCode code;

    @Size(max = 200)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "LAB_TEST_TYPE_SAMPLING_METHOD",
        joinColumns = @JoinColumn(name = "LAB_TEST_TYPE_ID", foreignKey = @ForeignKey(name="FK_LTSTTSMPMTH_LABTSTT")),
        inverseJoinColumns = @JoinColumn(name = "SAMPLING_METHOD_ID", foreignKey = @ForeignKey(name="FK_LTSTTSMPMTH_SMPMTH")),
        indexes = {
            @Index(name = "IX_LTSTTSMPMTH_LABTSTTID", columnList = "LAB_TEST_TYPE_ID"),
            @Index(name = "IX_LTSTTSMPMTH_SMPMTHID", columnList = "SAMPLING_METHOD_ID"),
        }
    )
    private List<SamplingMethod> samplingMethods = new ArrayList<>();

    protected LabTestType() {}

    public LabTestType
        (
            @NotNull LabTestTypeCode code,
            @Size(max = 200) String description,
            @NotNull List<SamplingMethod> samplingMethods
        )
    {
        this.code = code;
        this.description = description;
        this.samplingMethods = samplingMethods;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LabTestTypeCode getCode() { return code; }
    public void setCode(LabTestTypeCode code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<SamplingMethod> getSamplingMethods() { return samplingMethods; }
    public void setSamplingMethods(List<SamplingMethod> samplingMethods) { this.samplingMethods = samplingMethods; }
}
