package gov.fda.nctr.arlims.models.dto.lab_test_data;

import java.util.List;
import java.util.Optional;

import gov.fda.nctr.arlims.models.dto.*;


/// Represents possibly incomplete form data for the imported Salmonella test, based on form ARL-SAL.7.
public class ImportedSalmonellaTestFormData
{
    private Optional<Long> factsSampleNum = Optional.empty();
    private Optional<String> productName = Optional.empty();
    private Optional<String> sampleReceived = Optional.empty();
    private Optional<String> sampleReceivedFrom = Optional.empty();

    private Optional<Boolean> descriptionMatchesCR = Optional.empty();

    private Optional<LabelAttachmentType> labelAttachmentType = Optional.empty();

    private Optional<Boolean> containerMatchesCR = Optional.empty();
    private Optional<Signature> containerMatchesCRSignature = Optional.empty();

    private Optional<Boolean> codeMatchesCR = Optional.empty();
    private Optional<String> codeMatchesCRNotes = Optional.empty();
    private Optional<Signature> codeMatchesCRSignature = Optional.empty();

    private Optional<SamplingMethod> samplingMethod = Optional.empty();
    private Optional<String> samplingMethodExceptionNotes = Optional.empty();

    private Optional<String> balanceId = Optional.empty();
    private Optional<String> blenderJarId = Optional.empty();
    private Optional<String> bagId = Optional.empty();

    private Optional<Boolean> sampleSpike = Optional.empty();
    private Optional<Integer> spikePlateCount = Optional.empty();

    private Optional<String> preenrichMediumBatchId = Optional.empty();
    private Optional<String> preenrichIncubatorId = Optional.empty();
    private Optional<Boolean> preenrichPositiveControlGrowth = Optional.empty();
    private Optional<Boolean> preenrichMediumControlGrowth = Optional.empty();
    private Optional<Signature> preenrichSignature = Optional.empty();

    private Optional<String> rvBatchId = Optional.empty();
    private Optional<String> ttBatchId = Optional.empty();
    private Optional<String> bgBatchId = Optional.empty();
    private Optional<String> l2KiBatchId = Optional.empty();
    private Optional<String> rvttWaterBathId = Optional.empty();
    private Optional<Signature> rvttSignature = Optional.empty();

    private Optional<String> mBrothBatchId = Optional.empty();
    private Optional<String> mBrothWaterBathId = Optional.empty();
    private Optional<Signature> mBrothSignature = Optional.empty();

    private Optional<String> vidasInstrumentId = Optional.empty();
    private Optional<List<String>> vidasKitIds = Optional.empty();
    private Optional<List<Boolean>> vidasCompositesDetections = Optional.empty();
    private Optional<Boolean> vidasPositiveControlDetection = Optional.empty();
    private Optional<Boolean> vidasMediumControlDetection = Optional.empty();
    private Optional<Boolean> vidasSpikeDetection = Optional.empty();
    private Optional<Signature> vidasSignature = Optional.empty();

    private Optional<Boolean> systemControlsPositiveControlGrowth = Optional.empty();
    private Optional<Boolean> systemMediumPositiveControlGrowth = Optional.empty();
    private Optional<Signature> systemControlsSignature = Optional.empty();

    private Optional<Boolean> collectorControlsPositveControlGrowth = Optional.empty();
    private Optional<Boolean> collectorControlsMediumControlGrowth = Optional.empty();
    private Optional<Signature> collectorControlsSignature = Optional.empty();

    private Optional<Boolean> bacterialControlsUsed = Optional.empty();
    private Optional<Signature> bacterialControlsSignature = Optional.empty();

    private Optional<Integer> resultPositiveComponentsCount = Optional.empty();
    private Optional<Signature> resultSignature = Optional.empty();

    private Optional<ReserveSampleDisposition> reserveReserveSampleDisposition = Optional.empty();
    private Optional<List<String>> reserveSampleDestinations = Optional.empty();
    private Optional<String> reserveSampleNote = Optional.empty();

    private Optional<Signature> allCompletedSignature = Optional.empty();

    public Optional<Long> getFactsSampleNum()
    {
        return factsSampleNum;
    }

    public Optional<String> getProductName()
    {
        return productName;
    }

    public void setProductName(Optional<String> productName)
    {
        this.productName = productName;
    }

    public Optional<String> getSampleReceived()
    {
        return sampleReceived;
    }

    public void setSampleReceived(Optional<String> sampleReceived)
    {
        this.sampleReceived = sampleReceived;
    }

    public Optional<String> getSampleReceivedFrom()
    {
        return sampleReceivedFrom;
    }

    public void setSampleReceivedFrom(Optional<String> sampleReceivedFrom)
    {
        this.sampleReceivedFrom = sampleReceivedFrom;
    }

    public void setFactsSampleNum(Optional<Long> factsSampleNum)
    {
        this.factsSampleNum = factsSampleNum;
    }

    public Optional<Boolean> getDescriptionMatchesCR()
    {
        return descriptionMatchesCR;
    }

    public void setDescriptionMatchesCR(Optional<Boolean> descriptionMatchesCR)
    {
        this.descriptionMatchesCR = descriptionMatchesCR;
    }

    public Optional<LabelAttachmentType> getLabelAttachmentType()
    {
        return labelAttachmentType;
    }

    public void setLabelAttachmentType(Optional<LabelAttachmentType> labelAttachmentType)
    {
        this.labelAttachmentType = labelAttachmentType;
    }

    public Optional<Boolean> getContainerMatchesCR()
    {
        return containerMatchesCR;
    }

    public void setContainerMatchesCR(Optional<Boolean> containerMatchesCR)
    {
        this.containerMatchesCR = containerMatchesCR;
    }

    public Optional<Signature> getContainerMatchesCRSignature()
    {
        return containerMatchesCRSignature;
    }

    public void setContainerMatchesCRSignature(Optional<Signature> containerMatchesCRSignature)
    {
        this.containerMatchesCRSignature = containerMatchesCRSignature;
    }

    public Optional<Boolean> getCodeMatchesCR()
    {
        return codeMatchesCR;
    }

    public void setCodeMatchesCR(Optional<Boolean> codeMatchesCR)
    {
        this.codeMatchesCR = codeMatchesCR;
    }

    public Optional<String> getCodeMatchesCRNotes()
    {
        return codeMatchesCRNotes;
    }

    public void setCodeMatchesCRNotes(Optional<String> codeMatchesCRNotes)
    {
        this.codeMatchesCRNotes = codeMatchesCRNotes;
    }

    public Optional<Signature> getCodeMatchesCRSignature()
    {
        return codeMatchesCRSignature;
    }

    public void setCodeMatchesCRSignature(Optional<Signature> codeMatchesCRSignature)
    {
        this.codeMatchesCRSignature = codeMatchesCRSignature;
    }

    public Optional<SamplingMethod> getSamplingMethod()
    {
        return samplingMethod;
    }

    public void setSamplingMethod(Optional<SamplingMethod> samplingMethod)
    {
        this.samplingMethod = samplingMethod;
    }

    public Optional<String> getSamplingMethodExceptionNotes()
    {
        return samplingMethodExceptionNotes;
    }

    public void setSamplingMethodExceptionNotes(Optional<String> samplingMethodExceptionNotes)
    {
        this.samplingMethodExceptionNotes = samplingMethodExceptionNotes;
    }

    public Optional<String> getBalanceId()
    {
        return balanceId;
    }

    public void setBalanceId(Optional<String> balanceId)
    {
        this.balanceId = balanceId;
    }

    public Optional<String> getBlenderJarId()
    {
        return blenderJarId;
    }

    public void setBlenderJarId(Optional<String> blenderJarId)
    {
        this.blenderJarId = blenderJarId;
    }

    public Optional<String> getBagId()
    {
        return bagId;
    }

    public void setBagId(Optional<String> bagId)
    {
        this.bagId = bagId;
    }

    public Optional<Boolean> getSampleSpike()
    {
        return sampleSpike;
    }

    public void setSampleSpike(Optional<Boolean> sampleSpike)
    {
        this.sampleSpike = sampleSpike;
    }

    public Optional<Integer> getSpikePlateCount()
    {
        return spikePlateCount;
    }

    public void setSpikePlateCount(Optional<Integer> spikePlateCount)
    {
        this.spikePlateCount = spikePlateCount;
    }

    public Optional<String> getPreenrichMediumBatchId()
    {
        return preenrichMediumBatchId;
    }

    public void setPreenrichMediumBatchId(Optional<String> preenrichMediumBatchId)
    {
        this.preenrichMediumBatchId = preenrichMediumBatchId;
    }

    public Optional<String> getPreenrichIncubatorId()
    {
        return preenrichIncubatorId;
    }

    public void setPreenrichIncubatorId(Optional<String> preenrichIncubatorId)
    {
        this.preenrichIncubatorId = preenrichIncubatorId;
    }

    public Optional<Boolean> getPreenrichPositiveControlGrowth()
    {
        return preenrichPositiveControlGrowth;
    }

    public void setPreenrichPositiveControlGrowth(Optional<Boolean> preenrichPositiveControlGrowth)
    {
        this.preenrichPositiveControlGrowth = preenrichPositiveControlGrowth;
    }

    public Optional<Boolean> getPreenrichMediumControlGrowth()
    {
        return preenrichMediumControlGrowth;
    }

    public void setPreenrichMediumControlGrowth(Optional<Boolean> preenrichMediumControlGrowth)
    {
        this.preenrichMediumControlGrowth = preenrichMediumControlGrowth;
    }

    public Optional<Signature> getPreenrichSignature()
    {
        return preenrichSignature;
    }

    public void setPreenrichSignature(Optional<Signature> preenrichSignature)
    {
        this.preenrichSignature = preenrichSignature;
    }

    public Optional<String> getRvBatchId()
    {
        return rvBatchId;
    }

    public void setRvBatchId(Optional<String> rvBatchId)
    {
        this.rvBatchId = rvBatchId;
    }

    public Optional<String> getTtBatchId()
    {
        return ttBatchId;
    }

    public void setTtBatchId(Optional<String> ttBatchId)
    {
        this.ttBatchId = ttBatchId;
    }

    public Optional<String> getBgBatchId()
    {
        return bgBatchId;
    }

    public void setBgBatchId(Optional<String> bgBatchId)
    {
        this.bgBatchId = bgBatchId;
    }

    public Optional<String> getL2KiBatchId()
    {
        return l2KiBatchId;
    }

    public void setL2KiBatchId(Optional<String> l2KiBatchId)
    {
        this.l2KiBatchId = l2KiBatchId;
    }

    public Optional<String> getRvttWaterBathId()
    {
        return rvttWaterBathId;
    }

    public void setRvttWaterBathId(Optional<String> rvttWaterBathId)
    {
        this.rvttWaterBathId = rvttWaterBathId;
    }

    public Optional<Signature> getRvttSignature()
    {
        return rvttSignature;
    }

    public void setRvttSignature(Optional<Signature> rvttSignature)
    {
        this.rvttSignature = rvttSignature;
    }

    public Optional<String> getmBrothBatchId()
    {
        return mBrothBatchId;
    }

    public void setmBrothBatchId(Optional<String> mBrothBatchId)
    {
        this.mBrothBatchId = mBrothBatchId;
    }

    public Optional<String> getmBrothWaterBathId()
    {
        return mBrothWaterBathId;
    }

    public void setmBrothWaterBathId(Optional<String> mBrothWaterBathId)
    {
        this.mBrothWaterBathId = mBrothWaterBathId;
    }

    public Optional<Signature> getmBrothSignature()
    {
        return mBrothSignature;
    }

    public void setmBrothSignature(Optional<Signature> mBrothSignature)
    {
        this.mBrothSignature = mBrothSignature;
    }

    public Optional<String> getVidasInstrumentId()
    {
        return vidasInstrumentId;
    }

    public void setVidasInstrumentId(Optional<String> vidasInstrumentId)
    {
        this.vidasInstrumentId = vidasInstrumentId;
    }

    public Optional<List<String>> getVidasKitIds()
    {
        return vidasKitIds;
    }

    public void setVidasKitIds(Optional<List<String>> vidasKitIds)
    {
        this.vidasKitIds = vidasKitIds;
    }

    public Optional<List<Boolean>> getVidasCompositesDetections()
    {
        return vidasCompositesDetections;
    }

    public void setVidasCompositesDetections(Optional<List<Boolean>> vidasCompositesDetections)
    {
        this.vidasCompositesDetections = vidasCompositesDetections;
    }

    public Optional<Boolean> getVidasPositiveControlDetection()
    {
        return vidasPositiveControlDetection;
    }

    public void setVidasPositiveControlDetection(Optional<Boolean> vidasPositiveControlDetection)
    {
        this.vidasPositiveControlDetection = vidasPositiveControlDetection;
    }

    public Optional<Boolean> getVidasMediumControlDetection()
    {
        return vidasMediumControlDetection;
    }

    public void setVidasMediumControlDetection(Optional<Boolean> vidasMediumControlDetection)
    {
        this.vidasMediumControlDetection = vidasMediumControlDetection;
    }

    public Optional<Boolean> getVidasSpikeDetection()
    {
        return vidasSpikeDetection;
    }

    public void setVidasSpikeDetection(Optional<Boolean> vidasSpikeDetection)
    {
        this.vidasSpikeDetection = vidasSpikeDetection;
    }

    public Optional<Signature> getVidasSignature()
    {
        return vidasSignature;
    }

    public void setVidasSignature(Optional<Signature> vidasSignature)
    {
        this.vidasSignature = vidasSignature;
    }

    public Optional<Boolean> getSystemControlsPositiveControlGrowth()
    {
        return systemControlsPositiveControlGrowth;
    }

    public void setSystemControlsPositiveControlGrowth(Optional<Boolean> systemControlsPositiveControlGrowth)
    {
        this.systemControlsPositiveControlGrowth = systemControlsPositiveControlGrowth;
    }

    public Optional<Boolean> getSystemMediumPositiveControlGrowth()
    {
        return systemMediumPositiveControlGrowth;
    }

    public void setSystemMediumPositiveControlGrowth(Optional<Boolean> systemMediumPositiveControlGrowth)
    {
        this.systemMediumPositiveControlGrowth = systemMediumPositiveControlGrowth;
    }

    public Optional<Signature> getSystemControlsSignature()
    {
        return systemControlsSignature;
    }

    public void setSystemControlsSignature(Optional<Signature> systemControlsSignature)
    {
        this.systemControlsSignature = systemControlsSignature;
    }

    public Optional<Boolean> getCollectorControlsPositveControlGrowth()
    {
        return collectorControlsPositveControlGrowth;
    }

    public void setCollectorControlsPositveControlGrowth(Optional<Boolean> collectorControlsPositveControlGrowth)
    {
        this.collectorControlsPositveControlGrowth = collectorControlsPositveControlGrowth;
    }

    public Optional<Boolean> getCollectorControlsMediumControlGrowth()
    {
        return collectorControlsMediumControlGrowth;
    }

    public void setCollectorControlsMediumControlGrowth(Optional<Boolean> collectorControlsMediumControlGrowth)
    {
        this.collectorControlsMediumControlGrowth = collectorControlsMediumControlGrowth;
    }

    public Optional<Signature> getCollectorControlsSignature()
    {
        return collectorControlsSignature;
    }

    public void setCollectorControlsSignature(Optional<Signature> collectorControlsSignature)
    {
        this.collectorControlsSignature = collectorControlsSignature;
    }

    public Optional<Boolean> getBacterialControlsUsed()
    {
        return bacterialControlsUsed;
    }

    public void setBacterialControlsUsed(Optional<Boolean> bacterialControlsUsed)
    {
        this.bacterialControlsUsed = bacterialControlsUsed;
    }

    public Optional<Signature> getBacterialControlsSignature()
    {
        return bacterialControlsSignature;
    }

    public void setBacterialControlsSignature(Optional<Signature> bacterialControlsSignature)
    {
        this.bacterialControlsSignature = bacterialControlsSignature;
    }

    public Optional<Integer> getResultPositiveComponentsCount()
    {
        return resultPositiveComponentsCount;
    }

    public void setResultPositiveComponentsCount(Optional<Integer> resultPositiveComponentsCount)
    {
        this.resultPositiveComponentsCount = resultPositiveComponentsCount;
    }

    public Optional<Signature> getResultSignature()
    {
        return resultSignature;
    }

    public void setResultSignature(Optional<Signature> resultSignature)
    {
        this.resultSignature = resultSignature;
    }

    public Optional<ReserveSampleDisposition> getReserveReserveSampleDisposition()
    {
        return reserveReserveSampleDisposition;
    }

    public void setReserveReserveSampleDisposition(Optional<ReserveSampleDisposition> reserveReserveSampleDisposition)
    {
        this.reserveReserveSampleDisposition = reserveReserveSampleDisposition;
    }

    public Optional<List<String>> getReserveSampleDestinations()
    {
        return reserveSampleDestinations;
    }

    public void setReserveSampleDestinations(Optional<List<String>> reserveSampleDestinations)
    {
        this.reserveSampleDestinations = reserveSampleDestinations;
    }

    public Optional<String> getReserveSampleNote()
    {
        return reserveSampleNote;
    }

    public void setReserveSampleNote(Optional<String> reserveSampleNote)
    {
        this.reserveSampleNote = reserveSampleNote;
    }

    public Optional<Signature> getAllCompletedSignature()
    {
        return allCompletedSignature;
    }

    public void setAllCompletedSignature(Optional<Signature> allCompletedSignature)
    {
        this.allCompletedSignature = allCompletedSignature;
    }
}
