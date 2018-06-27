package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;


public class LabTestMetadata
{
    private long testId;
    private long sampleId;
    private long sampleNum;
    private String pacCode;
    private Optional<String> productName;
    private LabTestTypeCode testTypeCode;
    private String testTypeName;
    private Instant created;
    private long createdByEmpId;
    private Instant lastSaved;
    private long lastSavedByEmpId;
    private Optional<LocalDate> beginDate;
    private Optional<String> note;
    private Optional<Instant> reviewed;
    private Optional<Long> reviewedByEmpId;
    private Optional<Instant> savedToFacts;


    public LabTestMetadata
        (
            long testId,
            long sampleId,
            long sampleNum,
            String pacCode,
            Optional<String> productName,
            LabTestTypeCode testTypeCode,
            String testTypeName,
            Instant created,
            long createdByEmpId,
            Instant lastSaved,
            long lastSavedByEmpId,
            Optional<LocalDate> beginDate,
            Optional<String> note,
            Optional<Instant> reviewed,
            Optional<Long> reviewedByEmpId,
            Optional<Instant> savedToFacts
        )
    {
        this.testId = testId;
        this.sampleId = sampleId;
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.productName = productName;
        this.testTypeCode = testTypeCode;
        this.testTypeName = testTypeName;
        this.created = created;
        this.createdByEmpId = createdByEmpId;
        this.lastSaved = lastSaved;
        this.lastSavedByEmpId = lastSavedByEmpId;
        this.beginDate = beginDate;
        this.note = note;
        this.reviewed = reviewed;
        this.reviewedByEmpId = reviewedByEmpId;
        this.savedToFacts = savedToFacts;
    }

    public long getTestId() { return testId; }

    public long getSampleId() { return sampleId; }

    public long getSampleNum() { return sampleNum; }

    public String getPacCode() { return pacCode; }

    public Optional<String> getProductName() { return productName; }

    public LabTestTypeCode getTestTypeCode() { return testTypeCode; }

    public String getTestTypeName() { return testTypeName; }

    public Instant getCreated() { return created; }

    public long getCreatedByEmpId() { return createdByEmpId; }

    public Instant getLastSaved() { return lastSaved; }

    public long getLastSavedByEmpId() { return lastSavedByEmpId; }

    public Optional<LocalDate> getBeginDate() { return beginDate; }

    public Optional<String> getNote() { return note; }

    public Optional<Instant> getReviewed() { return reviewed; }

    public Optional<Long> getReviewedByEmpId() { return reviewedByEmpId; }

    public Optional<Instant> getSavedToFacts() { return savedToFacts; }
}
