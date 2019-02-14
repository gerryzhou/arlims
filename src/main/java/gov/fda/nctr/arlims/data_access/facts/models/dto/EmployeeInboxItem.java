package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;


public class EmployeeInboxItem
{
    private Long workId;

    private Long analysisSample;

    private Long sampleTrackingSubNum;

    // TODO: These should be added to the LABSDS PersonInbox endpoint (at least for product name) or removed.
    @JsonIgnore
    private String cfsanProductDesc = "DUMMY-PRODUCT-DESCR-TODO";
    @JsonIgnore
    private String lid = "DUMMYLID";
    @JsonIgnore
    private String paf = "DUMMYPAF";
    @JsonIgnore
    private Optional<String> splitInd = Optional.empty();
    @JsonIgnore
    private String samplingOrg = "DUMMYSORG";

    private String pacCode;

    private String statusCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ssZ", timezone="UTC")
    private Instant statusDate;

    private String subjectText;

    private String remarksText;

    private long personId;
    private String firstName;
    private String lastName;
    private String mdlIntlName;
    private String leadInd;

//    TODO: Re-enable if api starts delivering more ISO-like timestamp (as in lab inbox "dates"), instead of format like '9/30/13 12:00 AM'.
//    @JsonDeserialize(using = TimeIgnoringLocalDateDeserializer.class)
    @JsonIgnore
    private LocalDate registerTargetCompletionDate;


    protected EmployeeInboxItem() {}


    public Long getWorkId() { return workId; }

    public Long getAnalysisSample() { return analysisSample; }

    public Long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public String getCfsanProductDesc() { return cfsanProductDesc; }

    public String getLid() { return lid; }

    public String getPaf() { return paf; }

    public Optional<String> getSplitInd() { return splitInd; }

    public String getSamplingOrg() { return samplingOrg; }

    public String getPacCode() { return pacCode; }

    public String getStatusCode() { return statusCode; }

    public Instant getStatusDate() { return statusDate; }

    public String getSubjectText() { return subjectText; }

    public String getRemarksText() { return remarksText; }

    public LocalDate getRegisterTargetCompletionDate() { return registerTargetCompletionDate; }

    public long getPersonId() { return personId; }

    public String getFirstName() { return firstName; }

    public String getLastName() { return lastName; }

    public String getMdlIntlName() { return mdlIntlName; }

    public String getLeadInd() { return leadInd; }
}
