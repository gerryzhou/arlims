package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;


public class LabTestMetadata
{
    private long testId;
    private long sampleId;
    private String sampleNum;
    private String pac;
    private Optional<String> productName;
    private LabTestTypeCode testTypeCode;
    private String testTypeName;
    private Instant created;
    private String createdByEmpShortName;
    private Instant lastSaved;
    private String lastSavedByEmpShortName;
    private Optional<LocalDate> beginDate;
    private Optional<String> note;
    private Optional<String> stageStatusesJson;
    private Optional<Instant> reviewed;
    private Optional<String> reviewedByEmpShortName;
    private Optional<Instant> savedToFacts;


    public LabTestMetadata
        (
            long testId,
            long sampleId,
            String sampleNum,
            String pac,
            Optional<String> productName,
            LabTestTypeCode testTypeCode,
            String testTypeName,
            Instant created,
            String createdByEmpShortName,
            Instant lastSaved,
            String lastSavedByEmpShortName,
            Optional<LocalDate> beginDate,
            Optional<String> note,
            Optional<String> stageStatusesJson,
            Optional<Instant> reviewed,
            Optional<String> reviewedByEmpShortName,
            Optional<Instant> savedToFacts
        )
    {
        this.testId = testId;
        this.sampleId = sampleId;
        this.sampleNum = sampleNum;
        this.pac = pac;
        this.productName = productName;
        this.testTypeCode = testTypeCode;
        this.testTypeName = testTypeName;
        this.created = created;
        this.createdByEmpShortName = createdByEmpShortName;
        this.lastSaved = lastSaved;
        this.lastSavedByEmpShortName = lastSavedByEmpShortName;
        this.beginDate = beginDate;
        this.note = note;
        this.stageStatusesJson = stageStatusesJson;
        this.reviewed = reviewed;
        this.reviewedByEmpShortName = reviewedByEmpShortName;
        this.savedToFacts = savedToFacts;
    }

    public long getTestId() { return testId; }

    public long getSampleId() { return sampleId; }

    public String getSampleNum() { return sampleNum; }

    public String getPac() { return pac; }

    public Optional<String> getProductName() { return productName; }

    public LabTestTypeCode getTestTypeCode() { return testTypeCode; }

    public String getTestTypeName() { return testTypeName; }

    public Instant getCreated() { return created; }

    public String getCreatedByEmpShortName() { return createdByEmpShortName; }

    public Instant getLastSaved() { return lastSaved; }

    public String getLastSavedByEmpShortName() { return lastSavedByEmpShortName; }

    public Optional<LocalDate> getBeginDate() { return beginDate; }

    public Optional<String> getNote() { return note; }

    public Optional<String> getStageStatusesJson() { return stageStatusesJson; }

    public Optional<Instant> getReviewed() { return reviewed; }

    public Optional<String> getReviewedByEmpShortName() { return reviewedByEmpShortName; }

    public Optional<Instant> getSavedToFacts() { return savedToFacts; }
}
