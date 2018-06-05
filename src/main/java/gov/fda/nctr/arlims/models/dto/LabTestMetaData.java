package gov.fda.nctr.arlims.models.dto;

import java.sql.Date;
import java.sql.Timestamp;


public class LabTestMetaData
{
    private long testId;
    private long sampleNum;
    private String pacCode;
    private String testTypeName;
    private Date beginDate;

    private String note;

    private Timestamp saved;
    private Long savedByEmployeeId;

    private Timestamp reviewed;
    private Long reviewedByEmployeeId;

    public LabTestMetaData(long testId, long sampleNum, String pacCode, String testTypeName, Date beginDate, String note,
                           Timestamp saved, Long savedByEmployeeId, Timestamp reviewed, Long reviewedByEmployeeId)
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

    public Date getBeginDate()
    {
        return beginDate;
    }

    public String getNote()
    {
        return note;
    }

    public Timestamp getSaved()
    {
        return saved;
    }

    public Long getSavedByEmployeeId()
    {
        return savedByEmployeeId;
    }

    public Timestamp getReviewed()
    {
        return reviewed;
    }

    public Long getReviewedByEmployeeId()
    {
        return reviewedByEmployeeId;
    }
}
