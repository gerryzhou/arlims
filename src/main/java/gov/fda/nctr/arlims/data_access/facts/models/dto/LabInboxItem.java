package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.node.TextNode;


public class LabInboxItem
{
    private Long sampleTrackingNum;

    private Long sampleTrackingSubNum;

    private String cfsanProductDesc;

    private String statusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
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

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Instant requestDate;

    // API provides completion date as timestamp with timezone for what is really just a date.
    @JsonDeserialize(using = JsonTimestampToLocalDateDeserializer.class)
    private LocalDate scheduledCompletionDate;

    private String samplingOrg;

    private String accomplishingOrg;

    private Long accomplishingOrgId;

    private Long fdaOrganizationId;

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

//    @JsonIgnore
//    public Optional<LocalDate> getScheduledCompletionDate() { return Optional.ofNullable(scheduledCompletionDate); }

    public LocalDate getScheduledCompletionDate() { return scheduledCompletionDate; }


    public String getSamplingOrg() { return samplingOrg; }

    public String getAccomplishingOrg() { return accomplishingOrg; }

    public Long getAccomplishingOrgId() { return accomplishingOrgId; }

    public Long getFdaOrganizationId() { return fdaOrganizationId; }

    public String getResponsibleFirmCode() { return responsibleFirmCode; }

    public String getRvMeaning() { return rvMeaning; }

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

class JsonTimestampToLocalDateDeserializer extends JsonDeserializer<LocalDate>
{
    @Override
    public LocalDate deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException
    {
        TextNode node = jp.getCodec().readTree(jp);
        String dateString = node.textValue();

        int spaceIx = dateString.indexOf(' ');
        if ( spaceIx == -1 )
            return LocalDate.parse(dateString);
        else
            return LocalDate.parse(dateString.substring(0, spaceIx));
    }
}