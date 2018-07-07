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
    private String testTypeShortName;
    private Instant createdInstant;
    private String createdByEmpShortName;
    private Instant lastSavedInstant;
    private String lastSavedByEmpShortName;
    private Optional<LocalDate> beginDate;
    private Optional<String> note;
    private Optional<String> stageStatusesJson;
    private Optional<Instant> reviewedInstant;
    private Optional<String> reviewedByEmpShortName;
    private Optional<Instant> savedToFactsInstant;


    public LabTestMetadata
        (
            long testId,
            long sampleId,
            String sampleNum,
            String pac,
            Optional<String> productName,
            LabTestTypeCode testTypeCode,
            String testTypeName,
            String testTypeShortName,
            Instant createdInstant,
            String createdByEmpShortName,
            Instant lastSavedInstant,
            String lastSavedByEmpShortName,
            Optional<LocalDate> beginDate,
            Optional<String> note,
            Optional<String> stageStatusesJson,
            Optional<Instant> reviewedInstant,
            Optional<String> reviewedByEmpShortName,
            Optional<Instant> savedToFactsInstant
        )
    {
        this.testId = testId;
        this.sampleId = sampleId;
        this.sampleNum = sampleNum;
        this.pac = pac;
        this.productName = productName;
        this.testTypeCode = testTypeCode;
        this.testTypeName = testTypeName;
        this.testTypeShortName = testTypeShortName;
        this.createdInstant = createdInstant;
        this.createdByEmpShortName = createdByEmpShortName;
        this.lastSavedInstant = lastSavedInstant;
        this.lastSavedByEmpShortName = lastSavedByEmpShortName;
        this.beginDate = beginDate;
        this.note = note;
        this.stageStatusesJson = stageStatusesJson;
        this.reviewedInstant = reviewedInstant;
        this.reviewedByEmpShortName = reviewedByEmpShortName;
        this.savedToFactsInstant = savedToFactsInstant;
    }

    public long getTestId() { return testId; }

    public long getSampleId() { return sampleId; }

    public String getSampleNum() { return sampleNum; }

    public String getPac() { return pac; }

    public Optional<String> getProductName() { return productName; }

    public LabTestTypeCode getTestTypeCode() { return testTypeCode; }

    public String getTestTypeName() { return testTypeName; }

    public String getTestTypeShortName() { return testTypeShortName; }

    public Instant getCreatedInstant() { return createdInstant; }

    public String getCreatedByEmpShortName() { return createdByEmpShortName; }

    public Instant getLastSavedInstant() { return lastSavedInstant; }

    public String getLastSavedByEmpShortName() { return lastSavedByEmpShortName; }

    public Optional<LocalDate> getBeginDate() { return beginDate; }

    public Optional<String> getNote() { return note; }

    public Optional<String> getStageStatusesJson() { return stageStatusesJson; }

    public Optional<Instant> getReviewedInstant() { return reviewedInstant; }

    public Optional<String> getReviewedByEmpShortName() { return reviewedByEmpShortName; }

    public Optional<Instant> getSavedToFactsInstant() { return savedToFactsInstant; }
}
