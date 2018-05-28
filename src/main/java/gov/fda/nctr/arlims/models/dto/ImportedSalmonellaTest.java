package gov.fda.nctr.arlims.models.dto;

import java.util.List;


public class ImportedSalmonellaTest implements SubsCompositesDetections
{
    public ImportedSalmonellaTest
    (
        long sampleId,
        String packId
    )
    {
        this.sampleId = sampleId;
        this.packId = packId;
    }

    private Long sampleId;
    private String packId;

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

    private Boolean spikeAnalyzed;
    private Integer spikePosPlateCount;
    private Integer spikeNegPlateCount;

    private String    preenrichMediumBatchId;
    private String    preenrichIncubatorId;
    private Boolean   preenrichPositiveControlGrowth;
    private Boolean   preenrichMediumControlGrowth;
    private Signature preenrichSignature;

    private String rvBatchId;
    private String ttBatchId;
    private String ttBg;   // TODO: What is this? (Determine if more structure is needed for these.)
    private String ttL2Ki; //       "

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

    private Boolean   collectiveControlsPositveControlGrowth;
    private Boolean   collectiveControlsMediumControlGrowth;
    private Signature collectiveControlsSignature;

    private Boolean   bacterialControlsUsed;
    private Signature bacterialControlsSignature;

    private Integer   resultPositiveComponentsCount;
    private Signature resultSignature;

    private ReserveSampleDisposition reserveReserveSampleDisposition;
    private List<String>             reserveSampleDestinations;
    private String                   reserveSampleNote;

    private Signature allCompletedSignature;

    // TODO: Make getters and setters.
}
