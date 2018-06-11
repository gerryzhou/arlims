package gov.fda.nctr.arlims.models.db;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_EMP_USERNAME", columnNames = {"USERNAME"}),
        @UniqueConstraint(name="UN_EMP_SHORTNAMELABGRP", columnNames = {"SHORT_NAME", "LAB_GROUP_NAME"})
    },
    indexes = {
        @Index(name = "IX_EMP_LABGROUPNAME", columnList = "LAB_GROUP_NAME")
    }
)
public class Employee
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long factsPersonId;

    @Size(max = 30) @NotNull @NotBlank
    private String username;

    @Column(name = "SHORT_NAME") @Size(max = 10) @NotNull @NotBlank
    private String shortName;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "LAB_GROUP_NAME", foreignKey = @ForeignKey(name="FK_EMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_NAME", insertable = false, updatable = false, nullable = false)
    private String labGroupName;

    @Size(max = 200)
    private String password;

    @Size(max = 150) @NotNull @NotBlank @Email
    private String email;

    @Size(max = 60) @NotNull @NotBlank
    private String lastName;

    @Size(max = 60) @NotNull @NotBlank
    private String firstName;

    @Size(max = 60)
    private String middleNameOrInitial;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "SAMPLE_UNIT_ASSIGNMENT",
        joinColumns = @JoinColumn(name = "EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_SMPUNITAST_EMP")),
        inverseJoinColumns = @JoinColumn(name = "SAMPLE_UNIT_ID", foreignKey = @ForeignKey(name="FK_SMPUNITAST_SAMPLEUNIT")),
        indexes = {
            @Index(name = "IX_SMPGRPAST_EMPID", columnList = "EMPLOYEE_ID"),
            @Index(name = "IX_SMPGRPAST_SAMPUNITID", columnList = "SAMPLE_UNIT_ID"),
        }
    )
    private List<SampleUnit> assignedSampleUnits = new ArrayList<>();

    protected Employee() {}

    public Employee
        (
            Long factsPersonId,
            @Size(max = 20) @NotBlank String username,
            @Size(max = 10) @NotBlank String shortName,
            @NotNull LabGroup labGroup,
            @Size(max = 200) String password,
            @Size(max = 150) @NotBlank @Email String email,
            @Size(max = 60) @NotBlank String lastName,
            @Size(max = 60) @NotBlank String firstName,
            @Size(max = 60) String middleNameOrInitial,
            @NotNull List<SampleUnit> assignedSampleUnits
        )
    {
        this.factsPersonId = factsPersonId;
        this.username = username;
        this.shortName = shortName;
        this.labGroup = labGroup;
        this.labGroupName = labGroup.getName();
        this.password = password;
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleNameOrInitial = middleNameOrInitial;
        this.assignedSampleUnits = assignedSampleUnits;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getFactsPersonId() { return factsPersonId; }

    public void setFactsPersonId(Long factsPersonId) { this.factsPersonId = factsPersonId; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getShortName() { return shortName; }

    public void setShortName(String shortName) { this.shortName = shortName; }

    public LabGroup getLabGroup() { return labGroup; }

    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public String getLabGroupName() { return labGroupName; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleNameOrInitial() { return middleNameOrInitial; }

    public void setMiddleNameOrInitial(String middleNameOrInitial)
    {
        this.middleNameOrInitial = middleNameOrInitial;
    }

    public List<SampleUnit> getAssignedSampleUnits() { return assignedSampleUnits; }

    public void setAssignedSampleUnits(List<SampleUnit> assignedSampleUnits)
    {
        this.assignedSampleUnits = assignedSampleUnits;
    }

    @Override
    public String toString() { return "Employee[" + factsPersonId + ", " + username + ",...]"; }
}

