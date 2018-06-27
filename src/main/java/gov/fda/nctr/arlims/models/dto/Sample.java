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

    private List<String> assignedEmployeeShortNames;

    private List<LabTestMetadata> tests;

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
            List<String> assignedEmployeeShortNames,
            List<LabTestMetadata> tests,
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
        this.assignedEmployeeShortNames = assignedEmployeeShortNames;
        this.tests = tests;
        this.containingSampleLists = containingSampleLists;
    }

    public long getId() { return id; }

    public long getSampleNumber() { return sampleNum; }

    public Optional<String> getPacCode() { return pacCode; }

    public String getProductName() { return productName; }

    public boolean getActive() { return active; }

    public LocalDate getReceived() { return received; }

    public Optional<LocalDate> getTestBeginDate() { return testBeginDate; }

    public List<String> getAssignedEmployeeShortNames() { return assignedEmployeeShortNames; }

    public List<LabTestMetadata> getTests() { return tests; }

    public List<SampleListMetadata> getContainingSampleLists() { return containingSampleLists; }
}
