package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonFormat;


public class LabInboxItem
{
    private Long operationId;

    private Long sampleTrackingNumber;

    private Long sampleTrackingSubNumber;

    private String cfsanProductDesc;

    private String statusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ")
    private Instant statusDate;

    private String subject;

    private String pacCode;

    private String problemAreaFlag;

    private Long workRequestId;

    private String operationCode;

    private Long sampleAnalysisId;

    private Long requestedOperationNum;

    private LocalDate requestDate;

    private LocalDate scheduledCompletionDate;

    private String accomplishingOrgName;

    private Long accomplishingOrgId;

    private String responsibleFirmCode;

    private String leadIndicator;

    private Long assignedToPersonId;

    private String assignedToFirstName;

    private String assignedToLastName;

    private String assignmentStatusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ")
    private Instant assignmentStatusDate;

    private LocalDate workAssignmentDate;


    protected LabInboxItem() {}

    public Long getSampleTrackingNumber() { return sampleTrackingNumber; }

    public Long getSampleTrackingSubNumber() { return sampleTrackingSubNumber; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public String getSubject() { return subject; }

    public String getPacCode() { return pacCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public Long getOperationId() { return operationId; }

    public Long getWorkRequestId() { return workRequestId; }

    public String getOperationCode() { return operationCode; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }

    public Long getRequestedOperationNum() { return requestedOperationNum; }

    public LocalDate getRequestDate() { return requestDate; }

    public LocalDate getScheduledCompletionDate() { return scheduledCompletionDate; }

    public String getAccomplishingOrgName() { return accomplishingOrgName; }

    public Long getAccomplishingOrgId() { return accomplishingOrgId; }

    public String getResponsibleFirmCode() { return responsibleFirmCode; }

    public Long getAssignedToPersonId() { return assignedToPersonId; }

    public String getAssignedToFirstName() { return assignedToFirstName; }

    public String getAssignedToLastName() { return assignedToLastName; }

    public String getLeadIndicator() { return leadIndicator; }

    public String getAssignmentStatusCode() { return assignmentStatusCode; }

    public Instant getAssignmentStatusDate() { return assignmentStatusDate; }

    public LocalDate getWorkAssignmentDate() { return workAssignmentDate; }

    public boolean hasSameSampleAssignment(LabInboxItem item)
    {
        return
            Objects.equals(sampleTrackingNumber, item.getSampleTrackingNumber()) &&
            Objects.equals(sampleTrackingSubNumber, item.getSampleTrackingSubNumber()) &&
            Objects.equals(getAssignedToPersonId(), item.getAssignedToPersonId());
    }

    @Override
    public String toString()
    {
        return "LabInboxItem{" +
        "sampleTrackingNumber=" + sampleTrackingNumber +
        ", sampleTrackingSubNumber=" + sampleTrackingSubNumber +
        ", cfsanProductDesc='" + cfsanProductDesc + '\'' +
        ", statusCode='" + statusCode + '\'' +
        ", statusDate=" + statusDate +
        ", subject=" + subject +
        ", pacCode='" + pacCode + '\'' +
        ", problemAreaFlag='" + problemAreaFlag + '\'' +
        ", operationId=" + operationId +
        ", workRequestId=" + workRequestId +
        ", operationCode='" + operationCode + '\'' +
        ", sampleAnalysisId=" + sampleAnalysisId +
        ", requestedOperationNum=" + requestedOperationNum +
        ", requestDate=" + requestDate +
        ", scheduledCompletionDate=" + scheduledCompletionDate +
        ", accomplishingOrgName='" + accomplishingOrgName + '\'' +
        ", accomplishingOrgId=" + accomplishingOrgId +
        ", responsibleFirmCode='" + responsibleFirmCode + '\'' +
        ", assignedToPersonId=" + assignedToPersonId +
        ", leadIndicator='" + leadIndicator + '\'' +
        ", assignmentStatusCode='" + assignmentStatusCode + '\'' +
        ", assignmentStatusDate=" + assignmentStatusDate +
        ", workAssignmentDate=" + workAssignmentDate +
        '}';
    }

}

