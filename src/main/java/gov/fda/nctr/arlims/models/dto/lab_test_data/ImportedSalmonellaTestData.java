package gov.fda.nctr.arlims.models.dto.lab_test_data;

import gov.fda.nctr.arlims.models.dto.*;

import java.util.List;


public class ImportedSalmonellaTestData
{
    public ImportedSalmonellaTestData() { }

    private Long factsSampleNum;
    private String productName;
    private String sampleReceived;
    private String sampleReceivedFrom;

    private Boolean descriptionMatchesCR;

    private LabelAttachmentType labelAttachmentType;

    private Boolean containerMatchesCR;
    private Signature containerMatchesCRSignature;

    private Boolean codeMatchesCR;
    private String codeMatchesCRNotes;
    private Signature codeMatchesCRSignature;

    private SamplingMethod samplingMethod;
    private String samplingMethodExceptionNotes;

    private String balanceId;
    private String blenderJarId;
    private String bagId;

    private Boolean sampleSpike;
    private Integer spikePlateCount;

    private String preenrichMediumBatchId;
    private String preenrichIncubatorId;
    private Boolean preenrichPositiveControlGrowth;
    private Boolean preenrichMediumControlGrowth;
    private Signature preenrichSignature;

    private String rvBatchId;
    private String ttBatchId;
    private String bgBatchId;
    private String l2KiBatchId;
    private String rvttWaterBathId;
    private Signature rvttSignature;

    private String mBrothBatchId;
    private String mBrothWaterBathId;
    private Signature mBrothSignature;

    private String vidasInstrumentId;
    private List<String> vidasKitIds;
    private List<Boolean> vidasCompositesDetections;
    private Boolean vidasPositiveControlDetection;
    private Boolean vidasMediumControlDetection;
    private Boolean vidasSpikeDetection;
    private Signature vidasSignature;

    private Boolean systemControlsPositiveControlGrowth;
    private Boolean systemMediumPositiveControlGrowth;
    private Signature systemControlsSignature;

    private Boolean collectorControlsPositveControlGrowth;
    private Boolean collectorControlsMediumControlGrowth;
    private Signature collectorControlsSignature;

    private Boolean bacterialControlsUsed;
    private Signature bacterialControlsSignature;

    private Integer resultPositiveComponentsCount;
    private Signature resultSignature;

    private ReserveSampleDisposition reserveReserveSampleDisposition;
    private List<String> reserveSampleDestinations;
    private String reserveSampleNote;

    private Signature allCompletedSignature;

    public Long getFactsSampleNum()
    {
        return factsSampleNum;
    }

    public String getProductName()
    {
        return productName;
    }

    public void setProductName(String productName)
    {
        this.productName = productName;
    }

    public String getSampleReceived()
    {
        return sampleReceived;
    }

    public void setSampleReceived(String sampleReceived)
    {
        this.sampleReceived = sampleReceived;
    }

    public String getSampleReceivedFrom()
    {
        return sampleReceivedFrom;
    }

    public void setSampleReceivedFrom(String sampleReceivedFrom)
    {
        this.sampleReceivedFrom = sampleReceivedFrom;
    }

    public void setFactsSampleNum(Long factsSampleNum)
    {
        this.factsSampleNum = factsSampleNum;
    }

    public Boolean getDescriptionMatchesCR()
    {
        return descriptionMatchesCR;
    }

    public void setDescriptionMatchesCR(Boolean descriptionMatchesCR)
    {
        this.descriptionMatchesCR = descriptionMatchesCR;
    }

    public LabelAttachmentType getLabelAttachmentType()
    {
        return labelAttachmentType;
    }

    public void setLabelAttachmentType(LabelAttachmentType labelAttachmentType)
    {
        this.labelAttachmentType = labelAttachmentType;
    }

    public Boolean getContainerMatchesCR()
    {
        return containerMatchesCR;
    }

    public void setContainerMatchesCR(Boolean containerMatchesCR)
    {
        this.containerMatchesCR = containerMatchesCR;
    }

    public Signature getContainerMatchesCRSignature()
    {
        return containerMatchesCRSignature;
    }

    public void setContainerMatchesCRSignature(Signature containerMatchesCRSignature)
    {
        this.containerMatchesCRSignature = containerMatchesCRSignature;
    }

    public Boolean getCodeMatchesCR()
    {
        return codeMatchesCR;
    }

    public void setCodeMatchesCR(Boolean codeMatchesCR)
    {
        this.codeMatchesCR = codeMatchesCR;
    }

    public String getCodeMatchesCRNotes()
    {
        return codeMatchesCRNotes;
    }

    public void setCodeMatchesCRNotes(String codeMatchesCRNotes)
    {
        this.codeMatchesCRNotes = codeMatchesCRNotes;
    }

    public Signature getCodeMatchesCRSignature()
    {
        return codeMatchesCRSignature;
    }

    public void setCodeMatchesCRSignature(Signature codeMatchesCRSignature)
    {
        this.codeMatchesCRSignature = codeMatchesCRSignature;
    }

    public SamplingMethod getSamplingMethod()
    {
        return samplingMethod;
    }

    public void setSamplingMethod(SamplingMethod samplingMethod)
    {
        this.samplingMethod = samplingMethod;
    }

    public String getSamplingMethodExceptionNotes()
    {
        return samplingMethodExceptionNotes;
    }

    public void setSamplingMethodExceptionNotes(String samplingMethodExceptionNotes)
    {
        this.samplingMethodExceptionNotes = samplingMethodExceptionNotes;
    }

    public String getBalanceId()
    {
        return balanceId;
    }

    public void setBalanceId(String balanceId)
    {
        this.balanceId = balanceId;
    }

    public String getBlenderJarId()
    {
        return blenderJarId;
    }

    public void setBlenderJarId(String blenderJarId)
    {
        this.blenderJarId = blenderJarId;
    }

    public String getBagId()
    {
        return bagId;
    }

    public void setBagId(String bagId)
    {
        this.bagId = bagId;
    }

    public Boolean getSampleSpike()
    {
        return sampleSpike;
    }

    public void setSampleSpike(Boolean sampleSpike)
    {
        this.sampleSpike = sampleSpike;
    }

    public Integer getSpikePlateCount()
    {
        return spikePlateCount;
    }

    public void setSpikePlateCount(Integer spikePlateCount)
    {
        this.spikePlateCount = spikePlateCount;
    }

    public String getPreenrichMediumBatchId()
    {
        return preenrichMediumBatchId;
    }

    public void setPreenrichMediumBatchId(String preenrichMediumBatchId)
    {
        this.preenrichMediumBatchId = preenrichMediumBatchId;
    }

    public String getPreenrichIncubatorId()
    {
        return preenrichIncubatorId;
    }

    public void setPreenrichIncubatorId(String preenrichIncubatorId)
    {
        this.preenrichIncubatorId = preenrichIncubatorId;
    }

    public Boolean getPreenrichPositiveControlGrowth()
    {
        return preenrichPositiveControlGrowth;
    }

    public void setPreenrichPositiveControlGrowth(Boolean preenrichPositiveControlGrowth)
    {
        this.preenrichPositiveControlGrowth = preenrichPositiveControlGrowth;
    }

    public Boolean getPreenrichMediumControlGrowth()
    {
        return preenrichMediumControlGrowth;
    }

    public void setPreenrichMediumControlGrowth(Boolean preenrichMediumControlGrowth)
    {
        this.preenrichMediumControlGrowth = preenrichMediumControlGrowth;
    }

    public Signature getPreenrichSignature()
    {
        return preenrichSignature;
    }

    public void setPreenrichSignature(Signature preenrichSignature)
    {
        this.preenrichSignature = preenrichSignature;
    }

    public String getRvBatchId()
    {
        return rvBatchId;
    }

    public void setRvBatchId(String rvBatchId)
    {
        this.rvBatchId = rvBatchId;
    }

    public String getTtBatchId()
    {
        return ttBatchId;
    }

    public void setTtBatchId(String ttBatchId)
    {
        this.ttBatchId = ttBatchId;
    }

    public String getBgBatchId()
    {
        return bgBatchId;
    }

    public void setBgBatchId(String bgBatchId)
    {
        this.bgBatchId = bgBatchId;
    }

    public String getL2KiBatchId()
    {
        return l2KiBatchId;
    }

    public void setL2KiBatchId(String l2KiBatchId)
    {
        this.l2KiBatchId = l2KiBatchId;
    }

    public String getRvttWaterBathId()
    {
        return rvttWaterBathId;
    }

    public void setRvttWaterBathId(String rvttWaterBathId)
    {
        this.rvttWaterBathId = rvttWaterBathId;
    }

    public Signature getRvttSignature()
    {
        return rvttSignature;
    }

    public void setRvttSignature(Signature rvttSignature)
    {
        this.rvttSignature = rvttSignature;
    }

    public String getmBrothBatchId()
    {
        return mBrothBatchId;
    }

    public void setmBrothBatchId(String mBrothBatchId)
    {
        this.mBrothBatchId = mBrothBatchId;
    }

    public String getmBrothWaterBathId()
    {
        return mBrothWaterBathId;
    }

    public void setmBrothWaterBathId(String mBrothWaterBathId)
    {
        this.mBrothWaterBathId = mBrothWaterBathId;
    }

    public Signature getmBrothSignature()
    {
        return mBrothSignature;
    }

    public void setmBrothSignature(Signature mBrothSignature)
    {
        this.mBrothSignature = mBrothSignature;
    }

    public String getVidasInstrumentId()
    {
        return vidasInstrumentId;
    }

    public void setVidasInstrumentId(String vidasInstrumentId)
    {
        this.vidasInstrumentId = vidasInstrumentId;
    }

    public List<String> getVidasKitIds()
    {
        return vidasKitIds;
    }

    public void setVidasKitIds(List<String> vidasKitIds)
    {
        this.vidasKitIds = vidasKitIds;
    }

    public List<Boolean> getVidasCompositesDetections()
    {
        return vidasCompositesDetections;
    }

    public void setVidasCompositesDetections(List<Boolean> vidasCompositesDetections)
    {
        this.vidasCompositesDetections = vidasCompositesDetections;
    }

    public Boolean getVidasPositiveControlDetection()
    {
        return vidasPositiveControlDetection;
    }

    public void setVidasPositiveControlDetection(Boolean vidasPositiveControlDetection)
    {
        this.vidasPositiveControlDetection = vidasPositiveControlDetection;
    }

    public Boolean getVidasMediumControlDetection()
    {
        return vidasMediumControlDetection;
    }

    public void setVidasMediumControlDetection(Boolean vidasMediumControlDetection)
    {
        this.vidasMediumControlDetection = vidasMediumControlDetection;
    }

    public Boolean getVidasSpikeDetection()
    {
        return vidasSpikeDetection;
    }

    public void setVidasSpikeDetection(Boolean vidasSpikeDetection)
    {
        this.vidasSpikeDetection = vidasSpikeDetection;
    }

    public Signature getVidasSignature()
    {
        return vidasSignature;
    }

    public void setVidasSignature(Signature vidasSignature)
    {
        this.vidasSignature = vidasSignature;
    }

    public Boolean getSystemControlsPositiveControlGrowth()
    {
        return systemControlsPositiveControlGrowth;
    }

    public void setSystemControlsPositiveControlGrowth(Boolean systemControlsPositiveControlGrowth)
    {
        this.systemControlsPositiveControlGrowth = systemControlsPositiveControlGrowth;
    }

    public Boolean getSystemMediumPositiveControlGrowth()
    {
        return systemMediumPositiveControlGrowth;
    }

    public void setSystemMediumPositiveControlGrowth(Boolean systemMediumPositiveControlGrowth)
    {
        this.systemMediumPositiveControlGrowth = systemMediumPositiveControlGrowth;
    }

    public Signature getSystemControlsSignature()
    {
        return systemControlsSignature;
    }

    public void setSystemControlsSignature(Signature systemControlsSignature)
    {
        this.systemControlsSignature = systemControlsSignature;
    }

    public Boolean getCollectorControlsPositveControlGrowth()
    {
        return collectorControlsPositveControlGrowth;
    }

    public void setCollectorControlsPositveControlGrowth(Boolean collectorControlsPositveControlGrowth)
    {
        this.collectorControlsPositveControlGrowth = collectorControlsPositveControlGrowth;
    }

    public Boolean getCollectorControlsMediumControlGrowth()
    {
        return collectorControlsMediumControlGrowth;
    }

    public void setCollectorControlsMediumControlGrowth(Boolean collectorControlsMediumControlGrowth)
    {
        this.collectorControlsMediumControlGrowth = collectorControlsMediumControlGrowth;
    }

    public Signature getCollectorControlsSignature()
    {
        return collectorControlsSignature;
    }

    public void setCollectorControlsSignature(Signature collectorControlsSignature)
    {
        this.collectorControlsSignature = collectorControlsSignature;
    }

    public Boolean getBacterialControlsUsed()
    {
        return bacterialControlsUsed;
    }

    public void setBacterialControlsUsed(Boolean bacterialControlsUsed)
    {
        this.bacterialControlsUsed = bacterialControlsUsed;
    }

    public Signature getBacterialControlsSignature()
    {
        return bacterialControlsSignature;
    }

    public void setBacterialControlsSignature(Signature bacterialControlsSignature)
    {
        this.bacterialControlsSignature = bacterialControlsSignature;
    }

    public Integer getResultPositiveComponentsCount()
    {
        return resultPositiveComponentsCount;
    }

    public void setResultPositiveComponentsCount(Integer resultPositiveComponentsCount)
    {
        this.resultPositiveComponentsCount = resultPositiveComponentsCount;
    }

    public Signature getResultSignature()
    {
        return resultSignature;
    }

    public void setResultSignature(Signature resultSignature)
    {
        this.resultSignature = resultSignature;
    }

    public ReserveSampleDisposition getReserveReserveSampleDisposition()
    {
        return reserveReserveSampleDisposition;
    }

    public void setReserveReserveSampleDisposition(ReserveSampleDisposition reserveReserveSampleDisposition)
    {
        this.reserveReserveSampleDisposition = reserveReserveSampleDisposition;
    }

    public List<String> getReserveSampleDestinations()
    {
        return reserveSampleDestinations;
    }

    public void setReserveSampleDestinations(List<String> reserveSampleDestinations)
    {
        this.reserveSampleDestinations = reserveSampleDestinations;
    }

    public String getReserveSampleNote()
    {
        return reserveSampleNote;
    }

    public void setReserveSampleNote(String reserveSampleNote)
    {
        this.reserveSampleNote = reserveSampleNote;
    }

    public Signature getAllCompletedSignature()
    {
        return allCompletedSignature;
    }

    public void setAllCompletedSignature(Signature allCompletedSignature)
    {
        this.allCompletedSignature = allCompletedSignature;
    }
}
