package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonFormat;


public class LabInboxItem
{
    private Long operationId;

    private Long sampleTrackingNum;

    private Long sampleTrackingSubNum;

    private String cfsanProductDesc;

    private String statusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ")
    private Instant statusDate;

    private String subject;

    private String pacCode;

    private String problemAreaFlag;

    private Long workRqstId;

    private String operationCode;

    private Long sampleAnalysisId;

    private Long requestedOperationNum;

    private LocalDate requestDate;

    private LocalDate scheduledCompletionDate;

    private String accomplishingOrg;

    private Long accomplishingOrgId;

    private Long fdaOrganizationId;

    private String responsibleFirmCode;

    private String assignedToLeadInd;

    private Long assignedToPersonId;

    private String assignedToFirstName;

    private String assignedToLastName;

    private String assignedToStatusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ")
    private Instant assignedToStatusDate;

    private LocalDate assignedToWorkAssignmentDate;


    protected LabInboxItem() {}

    public Long getSampleTrackingNum() { return sampleTrackingNum; }

    public Long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public String getSubject() { return subject; }

    public String getPacCode() { return pacCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public Long getOperationId() { return operationId; }

    public Long getWorkRqstId() { return workRqstId; }

    public String getOperationCode() { return operationCode; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }

    public Long getRequestedOperationNum() { return requestedOperationNum; }

    public LocalDate getRequestDate() { return requestDate; }

    public LocalDate getScheduledCompletionDate() { return scheduledCompletionDate; }

    public String getAccomplishingOrg() { return accomplishingOrg; }

    public Long getAccomplishingOrgId() { return accomplishingOrgId; }

    public Long getFdaOrganizationId() { return fdaOrganizationId; }

    public String getResponsibleFirmCode() { return responsibleFirmCode; }

    public Long getAssignedToPersonId() { return assignedToPersonId; }

    public String getAssignedToFirstName() { return assignedToFirstName; }

    public String getAssignedToLastName() { return assignedToLastName; }

    public String getAssignedToLeadInd() { return assignedToLeadInd; }

    public String getAssignedToStatusCode() { return assignedToStatusCode; }

    public Instant getAssignedToStatusDate() { return assignedToStatusDate; }

    public LocalDate getAssignedToWorkAssignmentDate() { return assignedToWorkAssignmentDate; }

    public boolean hasSameSampleAssignment(LabInboxItem item)
    {
        return
            Objects.equals(sampleTrackingNum, item.getSampleTrackingNum()) &&
            Objects.equals(sampleTrackingSubNum, item.getSampleTrackingSubNum()) &&
            Objects.equals(getAssignedToPersonId(), item.getAssignedToPersonId());
    }

    @Override
    public String toString()
    {
        return "LabInboxItem{" +
        "sampleTrackingNum=" + sampleTrackingNum +
        ", sampleTrackingSubNum=" + sampleTrackingSubNum +
        ", cfsanProductDesc='" + cfsanProductDesc + '\'' +
        ", statusCode='" + statusCode + '\'' +
        ", statusDate=" + statusDate +
        ", subject=" + subject +
        ", pacCode='" + pacCode + '\'' +
        ", problemAreaFlag='" + problemAreaFlag + '\'' +
        ", operationId=" + operationId +
        ", workRqstId=" + workRqstId +
        ", operationCode='" + operationCode + '\'' +
        ", sampleAnalysisId=" + sampleAnalysisId +
        ", requestedOperationNum=" + requestedOperationNum +
        ", requestDate=" + requestDate +
        ", scheduledCompletionDate=" + scheduledCompletionDate +
        ", accomplishingOrg='" + accomplishingOrg + '\'' +
        ", accomplishingOrgId=" + accomplishingOrgId +
        ", fdaOrganizationId=" + fdaOrganizationId +
        ", responsibleFirmCode='" + responsibleFirmCode + '\'' +
        ", assignedToPersonId=" + assignedToPersonId +
        ", assignedToLeadInd='" + assignedToLeadInd + '\'' +
        ", assignedToStatusCode='" + assignedToStatusCode + '\'' +
        ", assignedToStatusDate=" + assignedToStatusDate +
        ", assignedToWorkAssignmentDate=" + assignedToWorkAssignmentDate +
        '}';
    }

}

