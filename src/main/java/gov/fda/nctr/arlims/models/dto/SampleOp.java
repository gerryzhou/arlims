package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


public class SampleOp
{
    private final long opId;

    private final long sampleTrackingNum;

    private final long sampleTrackingSubNum;

    private final String pac;

    private final Optional<String> lid;

    private final Optional<String> paf;

    private final String productName;

    private final Optional<String> splitInd;

    private final String factsStatus; // (code)

    private final Instant factsStatusTimestamp;

    private final Instant lastRefreshedFromFactsInstant;

    private final Optional<String> samplingOrganization;

    private final Optional<String> subject;

    private final Optional<List<LabTestMetadata>> tests;

    private final Optional<List<SampleOpAssignment>> assignments;

    public SampleOp
        (
            long opId,
            long sampleTrackingNum,
            long sampleTrackingSubNum,
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
            Optional<List<LabTestMetadata>> tests,
            Optional<List<SampleOpAssignment>> assignments
        )
    {
        this.opId = opId;
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
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
        this.tests = tests;
        this.assignments = assignments;
    }

    public long getOpId() { return opId; }

    public long getSampleTrackingNum() { return sampleTrackingNum; }

    public long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

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

    public Optional<List<LabTestMetadata>> getTests() { return tests; }

    public Optional<List<SampleOpAssignment>> getAssignments() { return assignments; }
}
