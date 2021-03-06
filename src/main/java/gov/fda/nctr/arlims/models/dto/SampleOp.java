package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


public class SampleOp
{
    private final long opId;

    private final long sampleTrackingNumber;

    private final long sampleTrackingSubNumber;

    private final String pac;

    private final Optional<String> lid;

    private final Optional<String> paf;

    private final String productName;

    private final Optional<String> factsStatus; // (code)

    private final Optional<Instant> factsStatusTimestamp;

    private final Optional<Instant> lastRefreshedFromFactsInstant;

    private final Optional<String> subject;

    private final Optional<List<LabTestMetadata>> tests;

    private final Optional<List<SampleOpAssignment>> assignments;

    public SampleOp
        (
            long opId,
            long sampleTrackingNumber,
            long sampleTrackingSubNumber,
            String pac,
            Optional<String> lid,
            Optional<String> paf,
            String productName,
            Optional<String> factsStatus,
            Optional<Instant> factsStatusTimestamp,
            Optional<Instant> lastRefreshedFromFactsInstant,
            Optional<String> subject,
            Optional<List<LabTestMetadata>> tests,
            Optional<List<SampleOpAssignment>> assignments
        )
    {
        this.opId = opId;
        this.sampleTrackingNumber = sampleTrackingNumber;
        this.sampleTrackingSubNumber = sampleTrackingSubNumber;
        this.pac = pac;
        this.lid = lid;
        this.paf = paf;
        this.productName = productName;
        this.factsStatus = factsStatus;
        this.factsStatusTimestamp = factsStatusTimestamp;
        this.lastRefreshedFromFactsInstant = lastRefreshedFromFactsInstant;
        this.subject = subject;
        this.tests = tests;
        this.assignments = assignments;
    }

    public long getOpId() { return opId; }

    public long getSampleTrackingNumber() { return sampleTrackingNumber; }

    public long getSampleTrackingSubNumber() { return sampleTrackingSubNumber; }

    public String getPac() { return pac; }

    public Optional<String> getLid() { return lid; }

    public Optional<String> getPaf() { return paf; }

    public String getProductName() { return productName; }

    public Optional<String> getFactsStatus() { return factsStatus; }

    public Optional<Instant> getFactsStatusTimestamp() { return factsStatusTimestamp; }

    public Optional<Instant> getLastRefreshedFromFactsInstant() { return lastRefreshedFromFactsInstant; }

    public Optional<String> getSubject() { return subject; }

    public Optional<List<LabTestMetadata>> getTests() { return tests; }

    public Optional<List<SampleOpAssignment>> getAssignments() { return assignments; }
}
