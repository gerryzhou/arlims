package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.time.LocalDate;
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

    private final Optional<LocalDate> received;

    private final String factsStatus;

    private final LocalDate factsStatusDate;

    private final Instant lastRefreshedFromFacts;

    private final Optional<String> samplingOrganization;

    private final Optional<String> subject;

    private final List<SampleAssignment> assignments;

    private final List<LabTestMetadata> tests;

    private final List<LabResourceListMetadata> associatedUnmanagedResourceLists;

    private final List<LabResourceListMetadata> associatedManagedResourceLists;

    public Sample
        (
            long id,
            String sampleNum,
            String pac,
            Optional<String> lid,
            Optional<String> paf,
            String productName,
            Optional<LocalDate> received,
            String factsStatus,
            LocalDate factsStatusDate,
            Instant lastRefreshedFromFacts,
            Optional<String> samplingOrganization,
            Optional<String> subject,
            List<SampleAssignment> assignments,
            List<LabTestMetadata> tests,
            List<LabResourceListMetadata> associatedUnmanagedResourceLists,
            List<LabResourceListMetadata> associatedManagedResourceLists
        )
    {
        this.id = id;
        this.sampleNum = sampleNum;
        this.pac = pac;
        this.lid = lid;
        this.paf = paf;
        this.productName = productName;
        this.received = received;
        this.factsStatus = factsStatus;
        this.factsStatusDate = factsStatusDate;
        this.lastRefreshedFromFacts = lastRefreshedFromFacts;
        this.samplingOrganization = samplingOrganization;
        this.subject = subject;
        this.assignments = assignments;
        this.tests = tests;
        this.associatedUnmanagedResourceLists = associatedUnmanagedResourceLists;
        this.associatedManagedResourceLists = associatedManagedResourceLists;
    }

    public long getId() { return id; }

    public String getSampleNumber() { return sampleNum; }

    public String getPac() { return pac; }

    public Optional<String> getLid() { return lid; }

    public Optional<String> getPaf() { return paf; }

    public String getProductName() { return productName; }

    public Optional<LocalDate> getReceived() { return received; }

    public String getFactsStatus() { return factsStatus; }

    public LocalDate getFactsStatusDate() { return factsStatusDate; }

    public Instant getLastRefreshedFromFacts() { return lastRefreshedFromFacts; }

    public Optional<String> getSamplingOrganization() { return samplingOrganization; }

    public Optional<String> getSubject() { return subject; }

    public List<SampleAssignment> getAssignments() { return assignments; }

    public List<LabTestMetadata> getTests() { return tests; }

    public List<LabResourceListMetadata> getAssociatedUnmanagedResourceLists() { return associatedUnmanagedResourceLists; }

    public List<LabResourceListMetadata> getAssociatedManagedResourceLists() { return associatedManagedResourceLists; }
}
