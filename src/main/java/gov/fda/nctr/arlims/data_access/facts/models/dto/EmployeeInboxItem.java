package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;


public class EmployeeInboxItem
{
    private Long operationId;

    private Long sampleTrackingNum;

    private Long sampleTrackingSubNumber;

    private Long sampleAnalysisId;

    @JsonAlias("cfsanPrductDescription")
    private String cfsanProductDesc;

    private String lidCode;

    private String problemAreaFlag;

    private String pacCode;

    private String statusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone = "UTC")
    private Instant statusDate;

    private String subjectText;

    private String remarksText;

    private long personId;
    private String firstName;
    private String lastName;
    private String mdlIntlName;
    private String leadInd;


    protected EmployeeInboxItem() {}


    public Long getOperationId() { return operationId; }

    public Long getSampleTrackingNum() { return sampleTrackingNum; }

    public Long getSampleTrackingSubNumber() { return sampleTrackingSubNumber; }

    public Long getSampleAnalysisId() { return sampleAnalysisId; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getLidCode() { return lidCode; }

    public String getProblemAreaFlag() { return problemAreaFlag; }

    public String getPacCode() { return pacCode; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public String getSubjectText() { return subjectText; }

    public String getRemarksText() { return remarksText; }

    public long getPersonId() { return personId; }

    public String getFirstName() { return firstName; }

    public String getLastName() { return lastName; }

    public String getMdlIntlName() { return mdlIntlName; }

    public String getLeadInd() { return leadInd; }

    @Override
    public String toString()
    {
        return "EmployeeInboxItem{" +
        "operationId=" + operationId +
        ", sampleTrackingNum=" + sampleTrackingNum +
        ", sampleTrackingSubNumber=" + sampleTrackingSubNumber +
        ", sampleAnalysisId=" + sampleAnalysisId +
        ", cfsanProductDesc='" + cfsanProductDesc + '\'' +
        ", lidCode='" + lidCode + '\'' +
        ", problemAreaFlag='" + problemAreaFlag + '\'' +
        ", pacCode='" + pacCode + '\'' +
        ", statusCode='" + statusCode + '\'' +
        ", statusDate=" + statusDate +
        ", subjectText='" + subjectText + '\'' +
        ", remarksText='" + remarksText + '\'' +
        ", personId=" + personId +
        ", firstName='" + firstName + '\'' +
        ", lastName='" + lastName + '\'' +
        ", mdlIntlName='" + mdlIntlName + '\'' +
        ", leadInd='" + leadInd + '\'' +
        '}';
    }
}
