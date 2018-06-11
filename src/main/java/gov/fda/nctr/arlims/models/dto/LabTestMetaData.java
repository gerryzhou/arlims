package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;


public class LabTestMetaData
{
    private long testId;
    private long sampleNum;
    private String pacCode;
    private String testTypeName;
    private Optional<LocalDate> beginDate;
    private Optional<String> note;
    private Instant lastModified;
    private Long lastModifiedByEmpId;
    private Optional<Instant> reviewed;
    private Optional<Long> reviewedByEmpId;

    public LabTestMetaData
    (
        long testId,
        long sampleNum,
        String pacCode,
        String testTypeName,
        Optional<LocalDate> beginDate,
        Optional<String> note,
        Instant lastModified,
        Long lastModifiedByEmpId,
        Optional<Instant> reviewed,
        Optional<Long> reviewedByEmpId
    )
    {
        this.testId = testId;
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.testTypeName = testTypeName;
        this.beginDate = beginDate;
        this.note = note;
        this.lastModified = lastModified;
        this.lastModifiedByEmpId = lastModifiedByEmpId;
        this.reviewed = reviewed;
        this.reviewedByEmpId = reviewedByEmpId;
    }

    public long getTestId()
    {
        return testId;
    }

    public long getSampleNum()
    {
        return sampleNum;
    }

    public String getPacCode()
    {
        return pacCode;
    }

    public String getTestTypeName()
    {
        return testTypeName;
    }

    public Optional<LocalDate> getBeginDate()
    {
        return beginDate;
    }

    public Optional<String> getNote()
    {
        return note;
    }

    public Instant getLastModified()
    {
        return lastModified;
    }

    public Long getLastModifiedByEmployeeId()
    {
        return lastModifiedByEmpId;
    }

    public Optional<Instant> getReviewed()
    {
        return reviewed;
    }

    public Optional<Long> getReviewedByEmployeeId()
    {
        return reviewedByEmpId;
    }
}
