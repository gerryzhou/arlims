package gov.fda.nctr.arlims.data_access.facts.models.dto;


public class SampleOpDetails
{
    private long operationId;

    private long sampleTrackingNum;

    private long sampleTrackingSubNumber;

    private String programAssignmentCode;

    private String problemAreaFlag;

    private String cfsanProductDesc;

    protected SampleOpDetails() {}

    public SampleOpDetails
        (
            long operationId,
            long sampleTrackingNum,
            long sampleTrackingSubNum,
            String programAssignmentCode,
            String problemAreaFlag,
            String cfsanProductDesc
        )
    {
        this.operationId = operationId;
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNumber = sampleTrackingSubNum;
        this.programAssignmentCode = programAssignmentCode;
        this.problemAreaFlag = problemAreaFlag;
        this.cfsanProductDesc = cfsanProductDesc;
    }

    public long getOperationId() { return operationId; }

    public long getSampleTrackingNum() { return sampleTrackingNum; }

    public long getSampleTrackingSubNumber() { return sampleTrackingSubNumber; }

    public String getProgramAssignmentCode() { return programAssignmentCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }
}
