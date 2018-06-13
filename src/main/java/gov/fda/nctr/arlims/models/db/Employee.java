package gov.fda.nctr.arlims.models.db;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_EMP_USERNAME", columnNames = {"USERNAME"}),
        @UniqueConstraint(name="UN_EMP_SHORTNAMELABGRP", columnNames = {"SHORT_NAME", "LAB_GROUP_ID"})
    },
    indexes = {
        @Index(name = "IX_EMP_LABGROUPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_EMP_FACTSPERSONID", columnList = "FACTS_PERSON_ID")
    }
)
public class Employee
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 30) @NotNull @NotBlank
    private String username;

    @Column(name = "SHORT_NAME") @Size(max = 10) @NotNull @NotBlank
    private String shortName;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_EMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "FACTS_PERSON_ID")
    private Long factsPersonId;

    @Size(max = 200)
    private String password;

    @Size(max = 150) @NotNull @NotBlank @Email
    private String email;

    @Size(max = 60) @NotNull @NotBlank
    private String lastName;

    @Size(max = 60) @NotNull @NotBlank
    private String firstName;

    @Size(max = 60)
    private String middleName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "SAMPLE_UNIT_ASSIGNMENT",
        joinColumns = @JoinColumn(name = "EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_SMPUNTAST_EMP")),
        inverseJoinColumns = @JoinColumn(name = "SAMPLE_UNIT_ID", foreignKey = @ForeignKey(name="FK_SMPUNTAST_SMPUNT")),
        indexes = {
            @Index(name = "IX_SMPUNTAST_EMPID", columnList = "EMPLOYEE_ID"),
            @Index(name = "IX_SMPUNTAST_SMPUNTID", columnList = "SAMPLE_UNIT_ID"),
        }
    )
    private Set<SampleUnit> assignedSamples = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "EMPLOYEE_ROLE",
        joinColumns = @JoinColumn(name = "EMPLOYEE_ID", foreignKey = @ForeignKey(name="FK_EMPROLE_EMP")),
        inverseJoinColumns = @JoinColumn(name = "ROLE_ID", foreignKey = @ForeignKey(name="FK_EMPROLE_ROLE")),
        indexes = {
            @Index(name = "IX_EMPROLE_EMPID", columnList = "EMPLOYEE_ID"),
            @Index(name = "IX_EMPROLE_ROLEID", columnList = "ROLE_ID"),
        }
    )
    private Set<Role> roles;


    protected Employee()
    {
        roles = new HashSet<>();
    }

    public Employee
        (
            @Size(max = 30) @NotBlank String username,
            @Size(max = 10) @NotBlank String shortName,
            @NotNull LabGroup labGroup,
            Long factsPersonId,
            @Size(max = 200) String password,
            @Size(max = 150) @NotBlank @Email String email,
            @Size(max = 60) @NotBlank String lastName,
            @Size(max = 60) @NotBlank String firstName,
            @Size(max = 60) String middleName,
            @NotNull Set<Role> roles
        )
    {
        this.factsPersonId = factsPersonId;
        this.username = username;
        this.shortName = shortName;
        this.labGroup = labGroup;
        this.password = password;
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.roles = roles;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public Long getFactsPersonId() { return factsPersonId; }
    public void setFactsPersonId(Long factsPersonId) { this.factsPersonId = factsPersonId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public Set<SampleUnit> getAssignedSamples() { return assignedSamples; }
    public void setAssignedSamples(Set<SampleUnit> assignedSamples) { this.assignedSamples = assignedSamples; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}

