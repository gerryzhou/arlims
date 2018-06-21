package gov.fda.nctr.arlims.models.db;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(name="UN_LABGRP_NAME", columnNames = {"NAME"}),
    }
)
public class LabGroup
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) @Size(max = 20) @NotBlank
    private String name;

    @Size(max = 200)
    private String addressStreet;

    @Size(max = 200)
    private String buildingsAndRooms;

    @Size(max = 200)
    private String addressCity;

    @Size(max = 2)
    private String addressState;

    @Size(max = 11)
    private String addressZip;

    @Size(max = 100)
    private String description;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "labGroup")
    private Set<Employee> employees = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "labGroup")
    private Set<LabResource> managedLabResources = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "labGroup")
    private Set<LabGroupTestType> testTypes = new HashSet<>();

    protected LabGroup() {}

    public LabGroup
        (
            @Size(max = 20)  @NotBlank String name,
            @Size(max = 200) String addressStreet,
            @Size(max = 200) String buildingsAndRooms,
            @Size(max = 200) String addressCity,
            @Size(max = 2)   String addressState,
            @Size(max = 11)  String addressZip,
            @Size(max = 100) String description
        )
    {
        this.name = name;
        this.addressStreet = addressStreet;
        this.buildingsAndRooms = buildingsAndRooms;
        this.addressCity = addressCity;
        this.addressState = addressState;
        this.addressZip = addressZip;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddressStreet() { return addressStreet; }
    public void setAddressStreet(String addressStreet) { this.addressStreet = addressStreet; }

    public String getBuildingsAndRooms() { return buildingsAndRooms; }
    public void setBuildingsAndRooms(String bldgsRms) { this.buildingsAndRooms = bldgsRms; }

    public String getAddressCity() { return addressCity; }
    public void setAddressCity(String addressCity) { this.addressCity = addressCity; }

    public String getAddressState() { return addressState; }
    public void setAddressState(String addressState) { this.addressState = addressState; }

    public String getAddressZip() { return addressZip; }
    public void setAddressZip(String addressZip) { this.addressZip = addressZip; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Set<Employee> getEmployees() { return employees; }
    public void setEmployees(Set<Employee> employees) { this.employees = employees; }

    public Set<LabResource> getManagedLabResources() { return managedLabResources; }
    public void setManagedLabResources(Set<LabResource> managedLabResources) { this.managedLabResources = managedLabResources; }

    public Set<LabGroupTestType> getTestTypes() { return testTypes; }
    public void setTestTypes(Set<LabGroupTestType> testTypes) { this.testTypes = testTypes; }
}

