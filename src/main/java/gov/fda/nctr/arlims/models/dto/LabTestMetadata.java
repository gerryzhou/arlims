package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;


public class LabTestMetadata
{
    private long testId;
    private long opId;
    private long sampleTrackingNumber;
    private long sampleTrackingSubNumber;
    private String pac;
    private String productName;
    private LabTestTypeCode testTypeCode;
    private String testTypeName;
    private String testTypeShortName;
    private Instant createdInstant;
    private String createdByEmpShortName;
    private Instant lastSavedInstant;
    private String lastSavedByEmpShortName;
    private int attachedFilesCount;
    private Optional<LocalDate> beginDate;
    private Optional<String> note;
    private Optional<String> stageStatusesJson;
    private Optional<Instant> reviewedInstant;
    private Optional<String> reviewedByEmpShortName;
    private Optional<Instant> savedToFactsInstant;
    private Optional<String> savedToFactsByEmpShortName;


    public LabTestMetadata
        (
            long testId,
            long opId,
            long sampleTrackingNumber,
            long sampleTrackingSubNumber,
            String pac,
            String productName,
            LabTestTypeCode testTypeCode,
            String testTypeName,
            String testTypeShortName,
            Instant createdInstant,
            String createdByEmpShortName,
            Instant lastSavedInstant,
            String lastSavedByEmpShortName,
            int attachedFilesCount,
            Optional<LocalDate> beginDate,
            Optional<String> note,
            Optional<String> stageStatusesJson,
            Optional<Instant> reviewedInstant,
            Optional<String> reviewedByEmpShortName,
            Optional<Instant> savedToFactsInstant,
            Optional<String> savedToFactsByEmpShortName
        )
    {
        this.testId = testId;
        this.opId = opId;
        this.sampleTrackingNumber = sampleTrackingNumber;
        this.sampleTrackingSubNumber = sampleTrackingSubNumber;
        this.pac = pac;
        this.productName = productName;
        this.testTypeCode = testTypeCode;
        this.testTypeName = testTypeName;
        this.testTypeShortName = testTypeShortName;
        this.createdInstant = createdInstant;
        this.createdByEmpShortName = createdByEmpShortName;
        this.lastSavedInstant = lastSavedInstant;
        this.lastSavedByEmpShortName = lastSavedByEmpShortName;
        this.attachedFilesCount = attachedFilesCount;
        this.beginDate = beginDate;
        this.note = note;
        this.stageStatusesJson = stageStatusesJson;
        this.reviewedInstant = reviewedInstant;
        this.reviewedByEmpShortName = reviewedByEmpShortName;
        this.savedToFactsInstant = savedToFactsInstant;
        this.savedToFactsByEmpShortName = savedToFactsByEmpShortName;
    }

    public long getTestId() { return testId; }

    public long getOpId() { return opId; }

    public long getSampleTrackingNumber() { return sampleTrackingNumber; }

    public long getSampleTrackingSubNumber() { return sampleTrackingSubNumber; }

    public String getPac() { return pac; }

    public String getProductName() { return productName; }

    public LabTestTypeCode getTestTypeCode() { return testTypeCode; }

    public String getTestTypeName() { return testTypeName; }

    public String getTestTypeShortName() { return testTypeShortName; }

    public Instant getCreatedInstant() { return createdInstant; }

    public String getCreatedByEmpShortName() { return createdByEmpShortName; }

    public Instant getLastSavedInstant() { return lastSavedInstant; }

    public String getLastSavedByEmpShortName() { return lastSavedByEmpShortName; }

    public int getAttachedFilesCount() { return attachedFilesCount; }

    public Optional<LocalDate> getBeginDate() { return beginDate; }

    public Optional<String> getNote() { return note; }

    public Optional<String> getStageStatusesJson() { return stageStatusesJson; }

    public Optional<Instant> getReviewedInstant() { return reviewedInstant; }

    public Optional<String> getReviewedByEmpShortName() { return reviewedByEmpShortName; }

    public Optional<Instant> getSavedToFactsInstant() { return savedToFactsInstant; }

    public Optional<String> getSavedToFactsByEmpShortName() { return savedToFactsByEmpShortName; }
}
