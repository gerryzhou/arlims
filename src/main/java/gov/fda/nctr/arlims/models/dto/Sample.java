package gov.fda.nctr.arlims.models.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public class Sample
{
    private long id;

    private long sampleNum;

    private Optional<String> pacCode;

    private String productName;

    private boolean active;

    private LocalDate received;

    private Optional<LocalDate> testBeginDate;

    private List<UserIdentification> assignedToEmployees;

    private List<LabTestMetaData> tests;

    private List<SampleListMetadata> containingSampleLists;

    public Sample
        (
            long id,
            long sampleNum,
            Optional<String> pacCode,
            String productName,
            boolean active,
            LocalDate received,
            Optional<LocalDate> testBeginDate,
            List<UserIdentification> assignedToEmployees,
            List<LabTestMetaData> tests,
            List<SampleListMetadata> containingSampleLists
        )
    {
        this.id = id;
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.productName = productName;
        this.active = active;
        this.received = received;
        this.testBeginDate = testBeginDate;
        this.assignedToEmployees = assignedToEmployees;
        this.tests = tests;
        this.containingSampleLists = containingSampleLists;
    }

    public long getId() { return id; }

    public long getSampleNum() { return sampleNum; }

    public Optional<String> getPacCode() { return pacCode; }

    public String getProductName() { return productName; }

    public boolean getActive() { return active; }

    public LocalDate getReceived() { return received; }

    public Optional<LocalDate> getTestBeginDate() { return testBeginDate; }

    public List<UserIdentification> getAssignedToEmployees() { return assignedToEmployees; }

    public List<LabTestMetaData> getTests() { return tests; }

    public List<SampleListMetadata> getContainingSampleLists() { return containingSampleLists; }
}
