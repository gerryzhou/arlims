package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_TSTT_CODE", columnNames = {"CODE"}),
        @UniqueConstraint(name="UN_TSTT_SHORTNAME", columnNames = {"SHORT_NAME"}),
        @UniqueConstraint(name="UN_TSTT_NAME", columnNames = {"NAME"}),
    }
)
public class TestType
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) @Column(length = 50) @NotNull
    private LabTestTypeCode code;

    @Column(name = "NAME", nullable = false) @Size(max = 80) @NotBlank
    private String name;

    @Column(name = "SHORT_NAME", nullable = false) @Size(max = 80) @NotBlank
    private String shortName;

    @Size(max = 2000)
    private String description;

    protected TestType() {}

    public TestType
        (
            @NotNull LabTestTypeCode code,
            @NotBlank String name,
            @NotBlank String shortName,
            @Size(max = 200) String description
        )
    {
        this.code = code;
        this.name = name;
        this.shortName = shortName;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LabTestTypeCode getCode() { return code; }
    public void setCode(LabTestTypeCode code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
