package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;


public class LabInboxItem
{
    private Long sampleTrackingNum;
    private Long sampleTrackingSubNum;
    private String cfsanProductDesc;
    private String statusCode;
    private Instant statusDate;
    private String subject;
    private String pacCode;
    private String problemAreaFlag;
    private String lidCode;
    private String splitInd;
    private Long workId;
    private Long workRqstId;
    private String operationCode;
    private Long sampleAnalysisId;
    private Long requestedOperationNum;
    private Instant requestDate;
    private String scheduledCompletionDate;
    private String samplingOrg;
    private String accomplishingOrg;
    private Long accomplishingOrgId;
    private Long fdaOrganizationId;
    private String responsibleFirmCode;
    private String rvMeaning;
    private String assignedToLeadInd;
    private Long assignedToPersonId;
    private String assignedToStatusCode;
    private Instant assignedToStatusDate;
    private Instant assignedToWorkAssignmentDate;

    protected LabInboxItem() {}

    public LabInboxItem
        (
            Long sampleTrackingNum,
            Long sampleTrackingSubNum,
            String cfsanProductDesc,
            String statusCode,
            Instant statusDate,
            String subject,
            String pacCode,
            String problemAreaFlag,
            String lidCode,
            String splitInd,
            Long workId,
            Long workRqstId,
            String operationCode,
            Long sampleAnalysisId,
            Long requestedOperationNum,
            Instant requestDate,
            String scheduledCompletionDate,
            String samplingOrg,
            String accomplishingOrg,
            Long accomplishingOrgId,
            Long fdaOrganizationId,
            String responsibleFirmCode,
            String rvMeaning,
            String assignedToLeadInd,
            Long assignedToPersonId,
            String assignedToStatusCode,
            Instant assignedToStatusDate,
            Instant assignedToWorkAssignmentDate
        )
    {
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.cfsanProductDesc = cfsanProductDesc;
        this.statusCode = statusCode;
        this.statusDate = statusDate;
        this.subject = subject;
        this.pacCode = pacCode;
        this.problemAreaFlag = problemAreaFlag;
        this.lidCode = lidCode;
        this.splitInd = splitInd;
        this.workId = workId;
        this.workRqstId = workRqstId;
        this.operationCode = operationCode;
        this.sampleAnalysisId = sampleAnalysisId;
        this.requestedOperationNum = requestedOperationNum;
        this.requestDate = requestDate;
        this.scheduledCompletionDate = scheduledCompletionDate;
        this.samplingOrg = samplingOrg;
        this.accomplishingOrg = accomplishingOrg;
        this.accomplishingOrgId = accomplishingOrgId;
        this.fdaOrganizationId = fdaOrganizationId;
        this.responsibleFirmCode = responsibleFirmCode;
        this.rvMeaning = rvMeaning;
        this.assignedToLeadInd = assignedToLeadInd;
        this.assignedToPersonId = assignedToPersonId;
        this.assignedToStatusCode = assignedToStatusCode;
        this.assignedToStatusDate = assignedToStatusDate;
        this.assignedToWorkAssignmentDate = assignedToWorkAssignmentDate;
    }

    public Long getSampleTrackingNum() { return sampleTrackingNum; }

    public Long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public String getSubject() { return subject; }

    public String getPacCode() { return pacCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public String getLidCode() { return lidCode; }

    public String getSplitInd() { return splitInd; }

    public Long getWorkId() { return workId; }

    public Long getWorkRqstId() { return workRqstId; }

    public String getOperationCode() { return operationCode; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }

    public Long getRequestedOperationNum() { return requestedOperationNum; }

    public Instant getRequestDate() { return requestDate; }

    public String getScheduledCompletionDate() { return scheduledCompletionDate; }

    public String getSamplingOrg() { return samplingOrg; }

    public String getAccomplishingOrg() { return accomplishingOrg; }

    public Long getAccomplishingOrgId() { return accomplishingOrgId; }

    public Long getFdaOrganizationId() { return fdaOrganizationId; }

    public String getResponsibleFirmCode() { return responsibleFirmCode; }

    public String getRvMeaning() { return rvMeaning; }

    public String getAssignedToLeadInd() { return assignedToLeadInd; }

    public Long getAssignedToPersonId() { return assignedToPersonId; }

    public String getAssignedToStatusCode() { return assignedToStatusCode; }

    public Instant getAssignedToStatusDate() { return assignedToStatusDate; }

    public Instant getAssignedToWorkAssignmentDate() { return assignedToWorkAssignmentDate; }

    @Override
    public String toString()
    {
        return "LabInboxItem{" +
        "sampleTrackingNum=" + sampleTrackingNum +
        ", sampleTrackingSubNum=" + sampleTrackingSubNum +
        ", cfsanProductDesc='" + cfsanProductDesc + '\'' +
        ", statusCode='" + statusCode + '\'' +
        ", statusDate=" + statusDate +
        ", subject='" + subject + '\'' +
        ", pacCode='" + pacCode + '\'' +
        ", problemAreaFlag='" + problemAreaFlag + '\'' +
        ", lidCode='" + lidCode + '\'' +
        ", splitInd='" + splitInd + '\'' +
        ", workId=" + workId +
        ", workRqstId=" + workRqstId +
        ", operationCode='" + operationCode + '\'' +
        ", sampleAnalysisId=" + sampleAnalysisId +
        ", requestedOperationNum=" + requestedOperationNum +
        ", requestDate=" + requestDate +
        ", scheduledCompletionDate='" + scheduledCompletionDate + '\'' +
        ", samplingOrg='" + samplingOrg + '\'' +
        ", accomplishingOrg='" + accomplishingOrg + '\'' +
        ", accomplishingOrgId=" + accomplishingOrgId +
        ", fdaOrganizationId=" + fdaOrganizationId +
        ", responsibleFirmCode='" + responsibleFirmCode + '\'' +
        ", rvMeaning='" + rvMeaning + '\'' +
        ", assignedToLeadInd='" + assignedToLeadInd + '\'' +
        ", assignedToPersonId=" + assignedToPersonId +
        ", assignedToStatusCode='" + assignedToStatusCode + '\'' +
        ", assignedToStatusDate=" + assignedToStatusDate +
        ", assignedToWorkAssignmentDate=" + assignedToWorkAssignmentDate +
        '}';
    }
}
