package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;


public class EmployeeInboxItem implements InboxItem
{
    private Long operationId;

    private Long sampleTrackingNumber;

    private Long sampleTrackingSubNumber;

    private Long sampleAnalysisId;

    private String cfsanProductDesc;

    private String lidCode;

    private String problemAreaFlag;

    private String pacCode;

    private String statusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ")
    private Instant statusDate;

    private String subjectText;

    private String remarks;

    private long personId;
    private String assignedToFirstName;
    private String assignedToLastName;
    private String assignedToMiddleName;
    private String leadIndicator;

    private LocalDate workAssignmentDate;


    protected EmployeeInboxItem() {}


    public Long getOperationId() { return operationId; }

    public Long getSampleTrackingNumber() { return sampleTrackingNumber; }

    public Long getSampleTrackingSubNumber() { return sampleTrackingSubNumber; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getLidCode() { return lidCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public String getPacCode() { return pacCode; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public String getSubjectText() { return subjectText; }

    public String getRemarks() { return remarks; }

    public long getPersonId() { return personId; }

    public String getAssignedToFirstName() { return assignedToFirstName; }

    public String getAssignedToLastName() { return assignedToLastName; }

    public String getAssignedToMiddleName() { return assignedToMiddleName; }

    public String getLeadIndicator() { return leadIndicator; }

    public LocalDate getWorkAssignmentDate() { return workAssignmentDate; }

    @Override
    public String toString()
    {
        return "EmployeeInboxItem{" +
        "operationId=" + operationId +
        ", sampleTrackingNumber=" + sampleTrackingNumber +
        ", sampleTrackingSubNumber=" + sampleTrackingSubNumber +
        ", sampleAnalysisId=" + sampleAnalysisId +
        ", cfsanProductDesc='" + cfsanProductDesc + '\'' +
        ", lidCode='" + lidCode + '\'' +
        ", problemAreaFlag='" + problemAreaFlag + '\'' +
        ", pacCode='" + pacCode + '\'' +
        ", statusCode='" + statusCode + '\'' +
        ", statusDate=" + statusDate +
        ", subjectText='" + subjectText + '\'' +
        ", remarks='" + remarks + '\'' +
        ", personId=" + personId +
        ", assignedToFirstName='" + assignedToFirstName + '\'' +
        ", assignedToLastName='" + assignedToLastName + '\'' +
        ", assignedToMiddleName='" + assignedToMiddleName + '\'' +
        ", leadIndicator='" + leadIndicator + '\'' +
        ", workAssignmentDate='" + workAssignmentDate + '\'' +
        '}';
    }
}
