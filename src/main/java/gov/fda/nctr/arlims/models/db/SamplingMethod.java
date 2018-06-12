package gov.fda.nctr.arlims.models.db;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_SMPMTH_NAME", columnNames = {"NAME"}),
    }
)
public class SamplingMethod
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) @Size(max = 50) @NotBlank
    private String name;

    @Size(max = 200)
    private String description;

    @NotNull
    private Integer subGrams;

    @NotNull
    private Integer numSubs;

    @NotNull
    private Integer numComps;

    @NotNull
    private Integer compGrams;

    @NotNull
    private Integer subsPerComp;


    protected SamplingMethod() {}

    public SamplingMethod
        (
            @Size(max = 50) @NotBlank String name,
            @Size(max = 200) String description,
            @NotNull Integer subGrams,
            @NotNull Integer numSubs,
            @NotNull Integer numComps,
            @NotNull Integer compGrams,
            @NotNull Integer subsPerComp
        )
    {
        this.name = name;
        this.description = description;
        this.subGrams = subGrams;
        this.numSubs = numSubs;
        this.numComps = numComps;
        this.compGrams = compGrams;
        this.subsPerComp = subsPerComp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getSubGrams() { return subGrams; }
    public void setSubGrams(Integer subGrams) { this.subGrams = subGrams; }

    public Integer getNumSubs() { return numSubs; }
    public void setNumSubs(Integer numSubs) { this.numSubs = numSubs; }

    public Integer getNumComps() { return numComps; }
    public void setNumComps(Integer numComps) { this.numComps = numComps; }

    public Integer getCompGrams() { return compGrams; }
    public void setCompGrams(Integer compGrams) { this.compGrams = compGrams; }

    public Integer getSubsPerComp() { return subsPerComp; }
    public void setSubsPerComp(Integer subsPerComp) { this.subsPerComp = subsPerComp; }
}
