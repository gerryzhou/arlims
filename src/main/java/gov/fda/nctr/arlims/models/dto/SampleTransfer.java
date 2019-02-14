package gov.fda.nctr.arlims.models.dto;

import java.time.LocalDate;
import java.util.Optional;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import gov.fda.nctr.arlims.data_access.facts.TimeIgnoringLocalDateDeserializer;


public class SampleTransfer
{
    private long sampleTrackingNum;

    private long sampleTrackingSubNum;

    private long receivedByPersonId;

    private String receivedByPersonFirstName;

    private String receivedByPersonLastName;

    private Optional<String> receivedByPersonMIddleName; // (like this with typo as in LABS DS api results)

    @JsonDeserialize(using = TimeIgnoringLocalDateDeserializer.class)
    private LocalDate receivedDate;

    private String receiverConfirmationInd;

    private long sentByPersonId;

    private String sentByPersonFirstName;

    private String sentByPersonLastName;

    private Optional<String> sentByPersonMiddleName;

    @JsonDeserialize(using = TimeIgnoringLocalDateDeserializer.class)
    private LocalDate sentDate;

    private String sentByOrgName;

    private Optional<String> remarks;

    protected SampleTransfer() {}

    public SampleTransfer
        (
            long sampleTrackingNum,
            long sampleTrackingSubNum,
            long receivedByPersonId,
            String receivedByPersonFirstName,
            String receivedByPersonLastName,
            Optional<String> receivedByPersonMiddleName,
            LocalDate receivedDate,
            String receiverConfirmationInd,
            long sentByPersonId,
            String sentByPersonFirstName,
            String sentByPersonLastName,
            Optional<String> sentByPersonMiddleName,
            LocalDate sentDate,
            String sentByOrgName,
            Optional<String> remarks
        )
    {
        this.sampleTrackingNum = sampleTrackingNum;
        this.sampleTrackingSubNum = sampleTrackingSubNum;
        this.receivedByPersonId = receivedByPersonId;
        this.receivedByPersonFirstName = receivedByPersonFirstName;
        this.receivedByPersonLastName = receivedByPersonLastName;
        this.receivedByPersonMIddleName = receivedByPersonMiddleName;
        this.receivedDate = receivedDate;
        this.receiverConfirmationInd = receiverConfirmationInd;
        this.sentByPersonId = sentByPersonId;
        this.sentByPersonFirstName = sentByPersonFirstName;
        this.sentByPersonLastName = sentByPersonLastName;
        this.sentByPersonMiddleName = sentByPersonMiddleName;
        this.sentDate = sentDate;
        this.sentByOrgName = sentByOrgName;
        this.remarks = remarks;
    }

    public long getSampleTrackingNum() { return sampleTrackingNum; }

    public long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public long getReceivedByPersonId() { return receivedByPersonId; }

    public String getReceivedByPersonFirstName() { return receivedByPersonFirstName; }

    public String getReceivedByPersonLastName() { return receivedByPersonLastName; }

    public Optional<String> getReceivedByPersonMiddleName() { return receivedByPersonMIddleName; }

    public LocalDate getReceivedDate() { return receivedDate; }

    public String getReceiverConfirmationInd() { return receiverConfirmationInd; }

    public long getSentByPersonId() { return sentByPersonId; }

    public String getSentByPersonFirstName() { return sentByPersonFirstName; }

    public String getSentByPersonLastName() { return sentByPersonLastName; }

    public Optional<String> getSentByPersonMiddleName() { return sentByPersonMiddleName; }

    public LocalDate getSentDate() { return sentDate; }

    public String getSentByOrgName() { return sentByOrgName; }

    public Optional<String> getRemarks() { return remarks; }
}
