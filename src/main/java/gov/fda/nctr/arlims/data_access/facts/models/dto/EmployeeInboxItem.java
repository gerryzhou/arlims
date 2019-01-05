package gov.fda.nctr.arlims.data_access.facts.models.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.fda.nctr.arlims.data_access.facts.JsonTimestampToLocalDateDeserializer;


public class EmployeeInboxItem
{
    private Long workId;

    private Long analysisSample;
    private Long collectionSample;
    private Long tdSampleNumber;

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

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSZ", timezone="UTC")
    private Instant statusDate;

    private String subjectText;

    private String remarksText;

    private long personId;
    private String firstName;
    private String lastName;
    private String mdlIntlName;
    private String leadInd;


    // API provides completion date as timestamp with timezone for what is really just a date.
    @JsonDeserialize(using = JsonTimestampToLocalDateDeserializer.class)
    private LocalDate registerTargetCompletionDate;


    protected EmployeeInboxItem() {}


    public Long getWorkId() { return workId; }

    public Long getAnalysisSample() { return analysisSample; }

    public Long getCollectionSample() { return collectionSample; }

    public Long getTdSampleNumber() { return tdSampleNumber; }

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
