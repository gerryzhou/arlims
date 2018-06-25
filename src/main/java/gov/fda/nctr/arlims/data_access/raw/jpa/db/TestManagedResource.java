package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Table(
    name = "TEST_MANAGED_RESOURCE",
    uniqueConstraints = {
        @UniqueConstraint(name="UN_TSTMANRSC_TSTIDRSCCD", columnNames = {"TEST_ID", "RESOURCE_CODE"}),
    },
    indexes = {
        @Index(name = "IX_TSTMANRSC_TSTID", columnList = "TEST_ID"),
        @Index(name = "IX_TSTMANRSC_RSCCD", columnList = "RESOURCE_CODE"),
    }
)
public class TestManagedResource
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "TEST_ID", foreignKey = @ForeignKey(name="FK_TSTMANRSC_TST")) @NotNull
    private Test test;

    @Column(name = "TEST_ID", insertable = false, updatable = false)
    private Long testId;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "RESOURCE_CODE", foreignKey = @ForeignKey(name="FK_TSTMANRSC_LABRSC")) @NotNull
    private LabResource labResource;

    @Column(name = "RESOURCE_CODE", insertable = false, updatable = false)
    private String resourceCode;

    public TestManagedResource
        (
            @NotNull Test test,
            @NotNull LabResource labResource
        )
    {
        this.test = test;
        this.testId = test.getId();
        this.labResource = labResource;
        this.resourceCode = labResource.getCode();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Test getTest() { return test; }
    public void setTest(Test test) { this.test = test; }

    public Long getTestId() { return testId; }

    public LabResource getLabResource() { return labResource; }
    public void setLabResource(LabResource labResource) { this.labResource = labResource; }

    public String getResourceCode() { return resourceCode; }
}
