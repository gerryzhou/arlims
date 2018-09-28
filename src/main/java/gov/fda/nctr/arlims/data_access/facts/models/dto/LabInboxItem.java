package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;


public class LabInboxItem
{
    private Long sampleTrackingNum;
    private Long sampleTrackingSubNum;
    private String cfsanProductDesc;
    private String statusCode;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Instant statusDate;
    private Optional<String> subject;
    private String pacCode;
    private String problemAreaFlag;
    private Optional<String> lidCode;
    private Optional<String> splitInd;
    private Long workId;
    private Long workRqstId;
    private String operationCode;
    private Long sampleAnalysisId;
    private Long requestedOperationNum;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Instant requestDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Optional<LocalDate> scheduledCompletionDate;
    private String samplingOrg;
    private String accomplishingOrg;
    private Long accomplishingOrgId;
    private Optional<Long> fdaOrganizationId;
    private String responsibleFirmCode;
    private String rvMeaning;
    private Long assignedToPersonId;
    private String assignedToFirstName;
    private String assignedToLastName;
    private String assignedToLeadInd;
    private String assignedToStatusCode;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Instant assignedToStatusDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Instant assignedToWorkAssignmentDate;

    protected LabInboxItem() {}

    public LabInboxItem
        (
            Long sampleTrackingNum,
            Long sampleTrackingSubNum,
            String cfsanProductDesc,
            String statusCode,
            Instant statusDate,
            Optional<String> subject,
            String pacCode,
            String problemAreaFlag,
            Optional<String> lidCode,
            Optional<String> splitInd,
            Long workId,
            Long workRqstId,
            String operationCode,
            Long sampleAnalysisId,
            Long requestedOperationNum,
            Instant requestDate,
            Optional<LocalDate> scheduledCompletionDate,
            String samplingOrg,
            String accomplishingOrg,
            Long accomplishingOrgId,
            Optional<Long> fdaOrganizationId,
            String responsibleFirmCode,
            String rvMeaning,
            Long assignedToPersonId,
            String assignedToFirstName,
            String assignedToLastName,
            String assignedToLeadInd,
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
        this.assignedToPersonId = assignedToPersonId;
        this.assignedToFirstName = assignedToFirstName;
        this.assignedToLastName = assignedToLastName;
        this.assignedToLeadInd = assignedToLeadInd;
        this.assignedToStatusCode = assignedToStatusCode;
        this.assignedToStatusDate = assignedToStatusDate;
        this.assignedToWorkAssignmentDate = assignedToWorkAssignmentDate;
    }

    public Long getSampleTrackingNum() { return sampleTrackingNum; }

    public Long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public Optional<String> getSubject() { return subject; }

    public String getPacCode() { return pacCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public Optional<String> getLidCode() { return lidCode; }

    public Optional<String> getSplitInd() { return splitInd; }

    public Long getWorkId() { return workId; }

    public Long getWorkRqstId() { return workRqstId; }

    public String getOperationCode() { return operationCode; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }

    public Long getRequestedOperationNum() { return requestedOperationNum; }

    public Instant getRequestDate() { return requestDate; }

    public Optional<LocalDate> getScheduledCompletionDate() { return scheduledCompletionDate; }

    public String getSamplingOrg() { return samplingOrg; }

    public String getAccomplishingOrg() { return accomplishingOrg; }

    public Long getAccomplishingOrgId() { return accomplishingOrgId; }

    public Optional<Long> getFdaOrganizationId() { return fdaOrganizationId; }

    public String getResponsibleFirmCode() { return responsibleFirmCode; }

    public String getRvMeaning() { return rvMeaning; }

    // TODO: These fields should be optional.

    public Long getAssignedToPersonId() { return assignedToPersonId; }

    public String getAssignedToFirstName() { return assignedToFirstName; }

    public String getAssignedToLastName() { return assignedToLastName; }

    public String getAssignedToLeadInd() { return assignedToLeadInd; }

    public String getAssignedToStatusCode() { return assignedToStatusCode; }

    public Instant getAssignedToStatusDate() { return assignedToStatusDate; }

    public Instant getAssignedToWorkAssignmentDate() { return assignedToWorkAssignmentDate; }

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
        ", lidCode=" + lidCode +
        ", splitInd=" + splitInd +
        ", workId=" + workId +
        ", workRqstId=" + workRqstId +
        ", operationCode='" + operationCode + '\'' +
        ", sampleAnalysisId=" + sampleAnalysisId +
        ", requestedOperationNum=" + requestedOperationNum +
        ", requestDate=" + requestDate +
        ", scheduledCompletionDate=" + scheduledCompletionDate +
        ", samplingOrg='" + samplingOrg + '\'' +
        ", accomplishingOrg='" + accomplishingOrg + '\'' +
        ", accomplishingOrgId=" + accomplishingOrgId +
        ", fdaOrganizationId=" + fdaOrganizationId +
        ", responsibleFirmCode='" + responsibleFirmCode + '\'' +
        ", rvMeaning='" + rvMeaning + '\'' +
        ", assignedToPersonId=" + assignedToPersonId +
        ", assignedToLeadInd='" + assignedToLeadInd + '\'' +
        ", assignedToStatusCode='" + assignedToStatusCode + '\'' +
        ", assignedToStatusDate=" + assignedToStatusDate +
        ", assignedToWorkAssignmentDate=" + assignedToWorkAssignmentDate +
        '}';
    }
}
