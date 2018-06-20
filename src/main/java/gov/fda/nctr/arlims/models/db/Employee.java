package gov.fda.nctr.arlims.models.db;

import java.util.Set;
import java.util.HashSet;
import javax.persistence.*;
import javax.validation.constraints.*;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_EMP_USERNAME", columnNames = {"USERNAME"}),
        @UniqueConstraint(name="UN_EMP_SHORTNAMELABGRP", columnNames = {"SHORT_NAME", "LAB_GROUP_ID"})
    },
    indexes = {
        @Index(name = "IX_EMP_LABGROUPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_EMP_FACTSPERSONID", columnList = "FACTS_PERSON_ID"),
        @Index(name = "IX_EMP_EMAIL", columnList = "EMAIL")
    }
)
public class Employee
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 30) @NotNull @NotBlank
    private String username;

    @Column(name = "SHORT_NAME", nullable = false) @Size(max = 10) @NotBlank
    private String shortName;

    @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_EMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "FACTS_PERSON_ID") @Null
    private Long factsPersonId;

    @Size(max = 200) @Null
    private String password;

    @Column(name = "EMAIL", nullable = false) @Size(max = 150) @NotBlank @Email
    private String email;

    @Size(max = 60) @NotNull @NotBlank
    private String lastName;

    @Size(max = 60) @NotNull @NotBlank
    private String firstName;

    @Size(max = 60) @Null
    private String middleName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "EMPLOYEE_ROLE",
        joinColumns = @JoinColumn(name = "EMP_ID", foreignKey = @ForeignKey(name="FK_EMPROLE_EMP")),
        inverseJoinColumns = @JoinColumn(name = "ROLE_ID", foreignKey = @ForeignKey(name="FK_EMPROLE_ROLE")),
        indexes = {
            @Index(name = "IX_EMPROLE_EMPID", columnList = "EMP_ID"),
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
            @Null Long factsPersonId,
            @Size(max = 200) @Null String password,
            @Size(max = 150) @NotBlank @Email String email,
            @Size(max = 60) @NotBlank String lastName,
            @Size(max = 60) @NotBlank String firstName,
            @Size(max = 60) @Null String middleName,
            @NotNull Set<Role> roles
        )
    {
        this.username = username;
        this.shortName = shortName;
        this.labGroup = labGroup;
        this.factsPersonId = factsPersonId;
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

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}

