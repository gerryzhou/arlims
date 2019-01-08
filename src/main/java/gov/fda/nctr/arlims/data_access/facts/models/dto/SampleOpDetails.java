package gov.fda.nctr.arlims.data_access.facts.models.dto;

public class SampleOpDetails
{
    private long workId;
    private long sampleTrackingNum;
    private long sampleTrackingSubNum;
    private String pacCode;
    private String cfsanProductDesc;

    protected SampleOpDetails() {}

    public SampleOpDetails
        (
            long opId,
            long sampleTrackingNum,
            long sampleTrackingSubNum,
            String pacCode,
            String cfsanProductDesc
        )
    {
        this.workId = opId;
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.pacCode = pacCode;
        this.cfsanProductDesc = cfsanProductDesc;
    }

    public long getWorkId() { return workId; }

    public long getSampleTrackingNum() { return sampleTrackingNum; }

    public long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public String getPacCode() { return pacCode; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }
}
