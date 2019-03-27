package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;


// {"sampleTrackingNumber":855957,"leadIndicator":"Y","operationCode":"43","personId":472629,"rvMeaning":"In Progress","sampleAnalysisId":889832,"sampleTrackingSubNumber":0,"statusCode":"I","statusDate":"2018-10-26 00:00:00.000-0400","workDetailsId":8539216,"operationId":8651834,"workRequestId":11657153,"assignedToFirstName":"Tripti","assignedToLastName":"Parajuli","assignedToMiddleName":"T","pacCode":"56008H","pacCodeDesc":"IMPORTED DRUGS (DPS)","cfsanProductDesc":"Bayer Asprin 100 mg","problemAreaFlag":"MIC","lidCode":"M","samplingDistrictOrgId":10020,"samplingDistrictOrgName":"DNEI","workAssignmentDate":"2018-10-26"}
public class EmployeeInboxItem
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
        '}';
    }
}
