package gov.fda.nctr.arlims.models.dto;

import java.util.List;


public class ImportedSalmonellaTest implements SubsCompositesDetections
{
    public ImportedSalmonellaTest() { }

    private Long factsSampleNum;

    private Boolean descriptionMatchesCR;

    private LabelAttachmentType labelAttachmentType;

    private Boolean   containerMatchesCR;
    private Signature containerMatchesCRSignature;

    private Boolean   codeMatchesCR;
    private String    codeMatchesCRNotes;
    private Signature codeMatchesCRSignature;

    private SamplingMethod samplingMethod;
    private String         samplingMethodExceptionNotes;

    private String balanceId;
    private String blenderJarId;
    private String bagId;

    private Boolean sampleSpike;
    private Integer spikePlateCount;

    private String    preenrichMediumBatchId;
    private String    preenrichIncubatorId;
    private Boolean   preenrichPositiveControlGrowth;
    private Boolean   preenrichMediumControlGrowth;
    private Signature preenrichSignature;

    private String rvBatchId;
    private String ttBatchId;
    private String bgBatchId;
    private String l2KiBatchId;
    private String    rvttWaterBathId;
    private Signature rvttSignature;

    private String    mBrothBatchId;
    private String    mBrothWaterBathId;
    private Signature mBrothSignature;

    private String        vidasInstrumentId;
    private List<String>  vidasKitIds;
    private List<Boolean> vidasCompositesDetections;
    private Boolean       vidasPositiveControlDetection;
    private Boolean       vidasMediumControlDetection;
    private Boolean       vidasSpikeDetection;
    private Signature     vidasSignature;

    private Boolean   systemControlsPositiveControlGrowth;
    private Boolean   systemMediumPositiveControlGrowth;
    private Signature systemControlsSignature;

    private Boolean   collectorControlsPositveControlGrowth;
    private Boolean   collectorControlsMediumControlGrowth;
    private Signature collectorControlsSignature;

    private Boolean   bacterialControlsUsed;
    private Signature bacterialControlsSignature;

    private Integer   resultPositiveComponentsCount;
    private Signature resultSignature;

    private ReserveSampleDisposition reserveReserveSampleDisposition;
    private List<String>             reserveSampleDestinations;
    private String                   reserveSampleNote;

    private Signature allCompletedSignature;


}
