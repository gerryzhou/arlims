package gov.fda.nctr.arlims.models.db;

import java.util.List;
import java.util.ArrayList;
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
    private List<Employee> employees = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "labGroup")
    private List<LabResource> resources = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "labGroup")
    private List<LabGroupTestType> testTypes = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "labGroup")
    private List<ActiveSample> activeSamples = new ArrayList<>();

    protected LabGroup() {}

    public LabGroup
        (
            @Size(max = 20) @NotBlank String name,
            @Size(max = 200) String addressStreet,
            @Size(max = 200) String buildingsAndRooms,
            @Size(max = 200) String addressCity,
            @Size(max = 2) String addressState,
            @Size(max = 11) String addressZip,
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

    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }

    public List<LabResource> getResources() { return resources; }
    public void setResources(List<LabResource> resources) { this.resources = resources; }

    public List<LabGroupTestType> getTestTypes() { return testTypes; }
    public void setTestTypes(List<LabGroupTestType> testTypes) { this.testTypes = testTypes; }

    public List<ActiveSample> getActiveSamples() { return activeSamples; }
    public void setActiveSamples(List<ActiveSample> activeSamples) { this.activeSamples = activeSamples; }
}

