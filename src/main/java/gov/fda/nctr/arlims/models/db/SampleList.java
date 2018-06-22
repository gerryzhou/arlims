package gov.fda.nctr.arlims.models.db;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.*;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_SMPLST_NAME", columnNames = {"NAME"}),
    },
    indexes = {
        @Index(name = "IX_SMPLST_LABGROUPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_SMPLST_CREATEDEMPID", columnList = "CREATED_BY_EMP_ID"),
        @Index(name = "IX_SMPLST_CREATED", columnList = "CREATED"),
    }
)
public class SampleList
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME", nullable = false) @Size(max = 30) @NotBlank
    private String name;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_SMPLST_LABGRP")) @NotNull
    private LabGroup labGroup;

    @NotNull
    private Instant created;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "CREATED_BY_EMP_ID", foreignKey = @ForeignKey(name="FK_SMPLST_EMP_CREATED")) @NotNull
    private Employee createdByEmployee;

    boolean active;

    @ManyToMany(fetch = FetchType.LAZY)
    @OrderColumn
    @JoinTable(
        name = "SAMPLE_LIST_SAMPLE",
        joinColumns = @JoinColumn(name = "SAMPLE_LIST_ID", foreignKey = @ForeignKey(name="FK_SMPLSTSMP_SMPLST")),
        inverseJoinColumns = @JoinColumn(name = "SAMPLE_ID", foreignKey = @ForeignKey(name="FK_SMPLSTSMP_SMP")),
        indexes = {
            @Index(name = "IX_SMPLSTSMP_SMPLSTID", columnList = "SAMPLE_LIST_ID"),
            @Index(name = "IX_SMPLSTSMP_SMPID", columnList = "SAMPLE_ID"),
        }
    )
    List<ReceivedSample> samples;

    protected SampleList()
    {
        samples = new ArrayList<>();
    }

    public SampleList
        (
            @NotBlank @Size(max = 30) String name,
            @NotNull LabGroup labGroup,
            @NotNull Instant created,
            @NotNull Employee createdByEmployee,
            boolean active,
            @NotNull List<ReceivedSample> samples
        )
    {
        this.name = name;
        this.labGroup = labGroup;
        this.created = created;
        this.createdByEmployee = createdByEmployee;
        this.active = active;
        this.samples = samples;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public Instant getCreated() { return created; }
    public void setCreated(Instant created) { this.created = created; }

    public Employee getCreatedByEmployee() { return createdByEmployee; }
    public void setCreatedByEmployee(Employee createdByEmployee) { this.createdByEmployee = createdByEmployee; }

    public boolean getActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<ReceivedSample> getSamples() { return samples; }
    public void setSamples(List<ReceivedSample> samples) { this.samples = samples; }
}

