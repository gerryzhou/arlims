package gov.fda.nctr.arlims.models.db;

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

    protected LabTestType() {}

    public LabTestType
        (
            @NotNull LabTestTypeCode code,
            @Size(max = 200) String description
        )
    {
        this.code = code;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LabTestTypeCode getCode() { return code; }
    public void setCode(LabTestTypeCode code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
