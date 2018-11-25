package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


public class Sample
{
    private final long id;

    private final String sampleNum;

    private final String pac;

    private final Optional<String> lid;

    private final Optional<String> paf;

    private final String productName;

    private final Optional<String> splitInd;

    private final String factsStatus;

    private final Instant factsStatusTimestamp;

    private final Instant lastRefreshedFromFactsInstant;

    private final Optional<String> samplingOrganization;

    private final Optional<String> subject;

    private final Optional<List<SampleAssignment>> assignments;

    private final Optional<List<LabTestMetadata>> tests;

    public Sample
        (
            long id,
            String sampleNum,
            String pac,
            Optional<String> lid,
            Optional<String> paf,
            String productName,
            Optional<String> splitInd,
            String factsStatus,
            Instant factsStatusTimestamp,
            Instant lastRefreshedFromFactsInstant,
            Optional<String> samplingOrganization,
            Optional<String> subject,
            Optional<List<SampleAssignment>> assignments,
            Optional<List<LabTestMetadata>> tests
        )
    {
        this.id = id;
        this.sampleNum = sampleNum;
        this.pac = pac;
        this.lid = lid;
        this.paf = paf;
        this.productName = productName;
        this.splitInd = splitInd;
        this.factsStatus = factsStatus;
        this.factsStatusTimestamp = factsStatusTimestamp;
        this.lastRefreshedFromFactsInstant = lastRefreshedFromFactsInstant;
        this.samplingOrganization = samplingOrganization;
        this.subject = subject;
        this.assignments = assignments;
        this.tests = tests;
    }

    public long getId() { return id; }

    public String getSampleNumber() { return sampleNum; }

    public String getPac() { return pac; }

    public Optional<String> getLid() { return lid; }

    public Optional<String> getPaf() { return paf; }

    public String getProductName() { return productName; }

    public Optional<String> getSplitInd() { return splitInd; }

    public String getFactsStatus() { return factsStatus; }

    public Instant getFactsStatusTimestamp() { return factsStatusTimestamp; }

    public Instant getLastRefreshedFromFactsInstant() { return lastRefreshedFromFactsInstant; }

    public Optional<String> getSamplingOrganization() { return samplingOrganization; }

    public Optional<String> getSubject() { return subject; }

    public Optional<List<SampleAssignment>> getAssignments() { return assignments; }

    public Optional<List<LabTestMetadata>> getTests() { return tests; }
}
