package gov.fda.nctr.arlims.models.dto;

import java.time.LocalDate;
import java.util.Optional;


public class SampleTransfer
{
    private long sampleTrackingNum;

    private long sampleTrackingSubNum;

    private long receivedByPersonId;

    private String receivedByPersonFirstName;

    private String receivedByPersonLastName;

    private LocalDate receivedDate;

    private String receiverConfirmationInd;

    private long sentByPersonId;

    private String sentByPersonFirstName;

    private String sentByPersonLastName;

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
            LocalDate receivedDate,
            String receiverConfirmationInd,
            long sentByPersonId,
            String sentByPersonFirstName,
            String sentByPersonLastName,
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
        this.receivedDate = receivedDate;
        this.receiverConfirmationInd = receiverConfirmationInd;
        this.sentByPersonId = sentByPersonId;
        this.sentByPersonFirstName = sentByPersonFirstName;
        this.sentByPersonLastName = sentByPersonLastName;
        this.sentDate = sentDate;
        this.sentByOrgName = sentByOrgName;
        this.remarks = remarks;
    }

    public long getSampleTrackingNum() { return sampleTrackingNum; }

    public long getSampleTrackingSubNum() { return sampleTrackingSubNum; }

    public long getReceivedByPersonId() { return receivedByPersonId; }

    public String getReceivedByPersonFirstName() { return receivedByPersonFirstName; }

    public String getReceivedByPersonLastName() { return receivedByPersonLastName; }

    public LocalDate getReceivedDate() { return receivedDate; }

    public String getReceiverConfirmationInd() { return receiverConfirmationInd; }

    public long getSentByPersonId() { return sentByPersonId; }

    public String getSentByPersonFirstName() { return sentByPersonFirstName; }

    public String getSentByPersonLastName() { return sentByPersonLastName; }

    public LocalDate getSentDate() { return sentDate; }

    public String getSentByOrgName() { return sentByOrgName; }

    public Optional<String> getRemarks() { return remarks; }
}
