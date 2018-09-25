package gov.fda.nctr.arlims.data_access.raw.jpa.db;

import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
@Table(
    name = "TEST_FILE",
    indexes = {
        @Index(name = "IX_TSTFILE_TSTID", columnList = "TEST_ID"),
    }
)
public class TestFile
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional=false)
    @JoinColumn(name = "TEST_ID", nullable = false, foreignKey = @ForeignKey(name="FK_TSTFILE_TST")) @NotNull
    private Test test;

    @Column(name = "TEST_ID", insertable = false, updatable = false, nullable = false)
    private Long testId;

    @Size(max = 50)
    private String role;

    @Column(name = "NAME", nullable = false) @Size(max = 200)
    private String name;

    @Column(nullable = false)
    private Instant uploaded;

    @Lob() @Basic(fetch = FetchType.LAZY) @NotNull
    private byte[] data;

    protected TestFile() {}

    public TestFile
        (
            @NotNull Test test,
            @Size(max = 50) String role,
            @Size(max = 200) String name,
            @NotNull byte[] data
        )
    {
        this.test = test;
        this.testId = test.getId();
        this.role = role;
        this.name = name;
        this.data = data;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Test getTest() { return test; }
    public void setTest(Test test) { this.test = test; }

    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
}
