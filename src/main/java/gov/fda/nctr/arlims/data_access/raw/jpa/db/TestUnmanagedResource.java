package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import gov.fda.nctr.arlims.models.dto.LabResourceType;


@Entity
@Table(
    name = "TEST_UNMANAGED_RESOURCE",
    uniqueConstraints = {
        @UniqueConstraint(name="UN_TSTUNMRSC_TSTIDRSCCDRSCT", columnNames = {"TEST_ID", "RESOURCE_CODE", "RESOURCE_TYPE"}),
    },
    indexes = {
        @Index(name = "IX_TSTUNMRSC_TSTID", columnList = "TEST_ID"),
        @Index(name = "IX_TSTUNMRSC_RSCCD", columnList = "RESOURCE_CODE"),
        @Index(name = "IX_TSTUNMRSC_RSCT", columnList = "RESOURCE_TYPE"),
    }
)
public class TestUnmanagedResource
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false) @JoinColumn(name = "TEST_ID", foreignKey = @ForeignKey(name="FK_TSTUNMRSC_TST")) @NotNull
    private Test test;

    @Column(name = "TEST_ID", insertable = false, updatable = false)
    private Long testId;

    @Column(name = "RESOURCE_CODE", length = 50, nullable = false) @Size(max = 50) @NotEmpty
    private String resourceCode;

    @Enumerated(EnumType.STRING) @Column(name = "RESOURCE_TYPE", length = 60)
    private LabResourceType resourceType;

    protected TestUnmanagedResource() {}

    public TestUnmanagedResource
        (
            @NotNull Test test,
            @Size(max = 50) @NotEmpty String resourceCode,
            LabResourceType resourceType
        )
    {
        this.test = test;
        this.testId = test.getId();
        this.resourceCode = resourceCode;
        this.resourceType = resourceType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Test getTest() { return test; }
    public void setTest(Test test) { this.test = test; }

    public Long getTestId() { return testId; }

    public String getResourceCode() { return resourceCode; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }

    public LabResourceType getResourceType() { return resourceType; }
    public void setResourceType(LabResourceType resourceType) { this.resourceType = resourceType; }
}
