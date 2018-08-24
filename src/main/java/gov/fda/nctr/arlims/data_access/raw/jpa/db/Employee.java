package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_EMP_FDAEMAILACCN", columnNames = {"FDA_EMAIL_ACCOUNT_NAME"}),
        @UniqueConstraint(name="UN_EMP_SHORTNAMELABGRP", columnNames = {"SHORT_NAME", "LAB_GROUP_ID"})
    },
    indexes = {
        @Index(name = "IX_EMP_LABGROUPID", columnList = "LAB_GROUP_ID"),
        @Index(name = "IX_EMP_FACTSPERSONID", columnList = "FACTS_PERSON_ID"),
    }
)
public class Employee
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FDA_EMAIL_ACCOUNT_NAME", nullable = false) @Size(max = 150) @NotBlank
    private String fdaEmailAccountName;

    @Column(name = "SHORT_NAME", nullable = false) @Size(max = 10) @NotBlank
    private String shortName;

    @ManyToOne(optional=false) @JoinColumn(name = "LAB_GROUP_ID", foreignKey = @ForeignKey(name="FK_EMP_LABGROUP")) @NotNull
    private LabGroup labGroup;

    @Column(name = "LAB_GROUP_ID", insertable = false, updatable = false)
    private Long labGroupId;

    @Column(name = "FACTS_PERSON_ID")
    private Long factsPersonId;

    @Size(max = 200)
    private String password;

    @Size(max = 60) @NotNull @NotBlank
    private String lastName;

    @Size(max = 60) @NotNull @NotBlank
    private String firstName;

    @Size(max = 60)
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
    }

    public Employee
        (
            @Size(max = 150) @NotBlank String fdaEmailAccountName,
            @Size(max = 10) @NotBlank String shortName,
            @NotNull LabGroup labGroup,
            Long factsPersonId,
            @Size(max = 200) String password,
            @Size(max = 60) @NotBlank String lastName,
            @Size(max = 60) @NotBlank String firstName,
            @Size(max = 60) String middleName,
            @NotNull Set<Role> roles
        )
    {
        this.fdaEmailAccountName = fdaEmailAccountName;
        this.shortName = shortName;
        this.labGroup = labGroup;
        this.labGroupId = labGroup.getId();
        this.factsPersonId = factsPersonId;
        this.password = password;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.roles = roles;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFdaEmailAccountName() { return fdaEmailAccountName; }
    public void setFdaEmailAccountName(String accountName ) { this.fdaEmailAccountName = accountName; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public LabGroup getLabGroup() { return labGroup; }
    public void setLabGroup(LabGroup labGroup) { this.labGroup = labGroup; }

    public Long getLabGroupId() { return labGroupId; }

    public Long getFactsPersonId() { return factsPersonId; }
    public void setFactsPersonId(Long factsPersonId) { this.factsPersonId = factsPersonId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}

