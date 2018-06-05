package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.time.LocalDate;

// TODO: If the LocalDate/Instant fields cause serialization problems, try setting mapDate param to asNumber or asString in maven typescript generator config.
public class LabTestMetaData
{
    private long testId;
    private long sampleNum;
    private String pacCode;
    private String testTypeName;
    private LocalDate beginDate;

    private String note;

    private Instant saved;
    private Long savedByEmployeeId;

    private Instant reviewed;
    private Long reviewedByEmployeeId;

    public LabTestMetaData(long testId, long sampleNum, String pacCode, String testTypeName, LocalDate beginDate, String note,
                           Instant saved, Long savedByEmployeeId, Instant reviewed, Long reviewedByEmployeeId)
    {
        this.testId = testId;
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.testTypeName = testTypeName;
        this.beginDate = beginDate;
        this.note = note;
        this.saved = saved;
        this.savedByEmployeeId = savedByEmployeeId;
        this.reviewed = reviewed;
        this.reviewedByEmployeeId = reviewedByEmployeeId;
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

    public LocalDate getBeginDate()
    {
        return beginDate;
    }

    public String getNote()
    {
        return note;
    }

    public Instant getSaved()
    {
        return saved;
    }

    public Long getSavedByEmployeeId()
    {
        return savedByEmployeeId;
    }

    public Instant getReviewed()
    {
        return reviewed;
    }

    public Long getReviewedByEmployeeId()
    {
        return reviewedByEmployeeId;
    }
}
