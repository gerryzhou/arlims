package gov.fda.nctr.arlims.data_access.facts.models.dto;

//@JsonIgnoreProperties(ignoreUnknown = true)
public class InboxItem
{
    private String sampleTrackingNum;
    private String sampleTrackingSubNum;
    private String cfsanProductDesc;
    private String pacCode;
    private String samplingOrg;
    private String subject;
    private String operationCode;

    protected InboxItem() {}

    public InboxItem
        (
            String sampleTrackingNum,
            String sampleTrackingSubNum,
            String cfsanProductDesc,
            String pacCode,
            String samplingOrg,
            String subject,
            String operationCode
        )
    {
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.cfsanProductDesc = cfsanProductDesc;
        this.pacCode = pacCode;
        this.samplingOrg = samplingOrg;
        this.subject = subject;
        this.operationCode = operationCode;
    }

    public String getSampleTrackingNum() { return sampleTrackingNum; }

    public String getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getPacCode() { return pacCode; }

    public String getSamplingOrg() { return samplingOrg; }

    public String getSubject() { return subject; }

    public String getOperationCode() { return operationCode; }
}
