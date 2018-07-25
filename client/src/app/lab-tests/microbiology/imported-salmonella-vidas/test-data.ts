// import {Signature} from '../../../shared/models/signature';
import {FieldValuesStatusCode, stageNameToTestDataFieldName, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SamplingMethod} from '../sampling-method';

// TODO: Remove signature fields (commented out) if signatures will be kept outside of the test data.

export interface TestData {
   prepData:     PrepData;
   preEnrData:   PreEnrData;
   selEnrData:   SelEnrData;
   mBrothData:   MBrothData;
   vidasData:    VidasData;
   controlsData: ControlsData;
   resultsData:  ResultsData;
   wrapupData:   WrapupData;
}

export interface PrepData {
   sampleReceived?: string;
   sampleReceivedFrom?: string;
   descriptionMatchesCR?: boolean;
   descriptionMatchesCRNotes?: string;
   labelAttachmentType?: LabelAttachmentType;
   containerMatchesCR?: boolean;
   containerMatchesCRNotes?: string;
   // containerMatchesCRSignature?: Signature;
   codeMatchesCR?: boolean;
   codeMatchesCRNotes?: string;
   // codeMatchesCRSignature?: Signature;
}

export interface PreEnrData {
   samplingMethod?: SamplingMethod;
   balanceId?: string;
   blenderJarId?: string;
   bagId?: string;
   sampleSpike?: boolean;
   spikePlateCount?: number;
   mediumBatchId?: string;
   incubatorId?: string;
   positiveControlGrowth?: boolean;
   mediumControlGrowth?: boolean;
   // preenrichSignature?: Signature;
}

export interface SelEnrData {
   rvBatchId?: string;
   ttBatchId?: string;
   bgBatchId?: string;
   l2KiBatchId?: string;
   rvttWaterBathId?: string;
   // rvttSignature?: Signature;
}

export interface MBrothData {
   mBrothBatchId?: string;
   mBrothWaterBathId?: string;
   // mBrothSignature?: Signature;
}

export interface VidasData {
   instrumentId?: string;
   kitIds?: string;
   compositesDetection?: boolean;
   positiveControlDetection?: boolean;
   mediumControlDetection?: boolean;
   spikeDetection?: boolean;
   // signature?: Signature;
}

export interface ControlsData {
   systemControlsPositiveControlGrowth?: boolean;
   systemMediumPositiveControlGrowth?: boolean;
   // systemControlsSignature?: Signature;
   collectorControlsPositveControlGrowth?: boolean;
   collectorControlsMediumControlGrowth?: boolean;
   // collectorControlsSignature?: Signature;
   bacterialControlsUsed?: boolean;
   // bacterialControlsSignature?: Signature;
}

export interface ResultsData {
   resultPositiveCompositesCount?: number;
   // resultSignature?: Signature;
}

export interface WrapupData {
   reserveReserveSampleDisposition?: ReserveSampleDisposition;
   reserveSampleDestinations?: string;
   reserveSampleNote?: string;
   // allCompletedSignature?: Signature;
}

export type LabelAttachmentType = 'NONE' | 'ATTACHED_ORIGINAL' | 'ATTACHED_COPY' | 'SUBMITTED_ALONE';

export type ReserveSampleDisposition = 'NO_RESERVE_SAMPLE' | 'SAMPLE_DISCARDED_AFTER_ANALYSIS' | 'ISOLATES_SENT' | 'OTHER';

// Empty test data should define all fields necessary to reach the leaf data elements which are bound
// to form controls, other than the leaf data elements themselves.
export function emptyTestData(): TestData {
   return {
      prepData: {},
      preEnrData: { samplingMethod: {}},
      selEnrData: {},
      mBrothData: {},
      vidasData: {},
      controlsData: {},
      resultsData: {},
      wrapupData: {},
   };
}

interface Stage {
   name: string;
   statusCodeFn: (any) => FieldValuesStatusCode;
}

const stages: Stage[] = [
   {name: 'PREP',     statusCodeFn: prepStatusCode},
   {name: 'PRE-ENR',  statusCodeFn: preEnrStatusCode},
   {name: 'SEL-ENR',  statusCodeFn: selEnrStatusCode},
   {name: 'M-BROTH',  statusCodeFn: mBrothStatusCode},
   {name: 'VIDAS',    statusCodeFn: vidasStatusCode},
   {name: 'CONTROLS', statusCodeFn: controlsStatusCode},
   {name: 'RESULTS',  statusCodeFn: resultsStatusCode},
   {name: 'WRAPUP',   statusCodeFn: wrapupStatusCode},
];

function prepStatusCode(data: PrepData): FieldValuesStatusCode {
   const reqStatus = statusForRequiredFieldValues([
      data.sampleReceived,
      data.sampleReceivedFrom,
      data.descriptionMatchesCR,
      // (descriptionMatchesCRNotes is not required)
      data.labelAttachmentType,
      data.containerMatchesCR,
      // (containerMatchesCRNotes is not required)
      // data.containerMatchesCRSignature,
      data.codeMatchesCR,
      // (codeMatchesCRNotes is not required)
      // data.codeMatchesCRSignature
   ]);

   if (reqStatus === 'e') {
      // Non-required fields could affect empty status.
      return (data.descriptionMatchesCRNotes || data.containerMatchesCRNotes || data.codeMatchesCR) ? 'i' : 'e';
   } else {
      return reqStatus;
   }
}

function preEnrStatusCode(data: PreEnrData): FieldValuesStatusCode {
   // Check unconditional top-level fields.
   const uncondTopLevelFieldsStatus = statusForRequiredFieldValues([
      data.balanceId,
      data.blenderJarId,
      data.bagId,
      data.sampleSpike,
      data.mediumBatchId,
      data.incubatorId,
      data.positiveControlGrowth,
      data.mediumControlGrowth,
      // data.preenrichSignature
   ]);

   // Check nested sampling method fields.
   const samplingMethodFieldsStatus =
      !data.samplingMethod ? 'e' :
         statusForRequiredFieldValues([
            data.samplingMethod.numberOfSubs,
            data.samplingMethod.numberOfComposites,
            data.samplingMethod.numberOfSubsPerComposite,
            data.samplingMethod.compositeMassGrams,
            data.samplingMethod.extractedGramsPerSub,
         ]);

   // Spike count is conditional on sampleSpike field.
   const spikeCountMissing = !!data.sampleSpike && !data.spikePlateCount;

   return (
      uncondTopLevelFieldsStatus === 'i' || samplingMethodFieldsStatus === 'i' ? 'i'
         : uncondTopLevelFieldsStatus === 'c' && (samplingMethodFieldsStatus !== 'c' || spikeCountMissing) ? 'i'
         : uncondTopLevelFieldsStatus === 'e' && (samplingMethodFieldsStatus !== 'e' || data.spikePlateCount) ? 'i'
         : uncondTopLevelFieldsStatus
   );
}

function selEnrStatusCode(data: SelEnrData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.rvBatchId,
      data.ttBatchId,
      // data.bgBatchId,  TODO: Are these two required?
      // data.l2KiBatchId,
      data.rvttWaterBathId,
      // data.rvttSignature,
   ]);
}

function mBrothStatusCode(data: MBrothData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.mBrothBatchId,
      data.mBrothWaterBathId,
      // data.mBrothSignature,
   ]);
}

function vidasStatusCode(data: VidasData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.instrumentId,
      data.kitIds,
      data.compositesDetection, // TODO: May need an array of detection status by composite #.
      data.positiveControlDetection,
      data.mediumControlDetection,
      data.spikeDetection,
      // data.signature,
   ]);
}

function controlsStatusCode(data: ControlsData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.systemControlsPositiveControlGrowth,
      data.systemMediumPositiveControlGrowth,
      // data.systemControlsSignature,
      data.collectorControlsPositveControlGrowth,
      data.collectorControlsMediumControlGrowth,
      // data.collectorControlsSignature,
      data.bacterialControlsUsed,
      // data.bacterialControlsSignature,
   ]);
}

function resultsStatusCode(data: ResultsData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.resultPositiveCompositesCount,
      // data.resultSignature,
   ]);
}

function wrapupStatusCode(data: WrapupData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.reserveReserveSampleDisposition,
      data.reserveSampleDestinations,
      // data.allCompletedSignature,
   ]);
}

export function getTestStageStatuses(testData: TestData): TestStageStatus[] {
   return stages.map(stage => {
      const stageFieldName = stageNameToTestDataFieldName(stage.name);
      const stageData = testData[stageFieldName];
      return {
         stageName: stage.name,
         fieldValuesStatus: stageData ? stage.statusCodeFn(stageData) : 'e'
      };
   });
}

