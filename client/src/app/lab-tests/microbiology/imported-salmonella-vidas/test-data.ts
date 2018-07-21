import {Signature} from '../../../shared/models/signature';
import {FieldValuesStatusCode, stageNameToTestDataFieldName, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SamplingMethod} from '../sampling-method';

export interface TestData {
   prepData: PrepData;
   preEnrData: PreEnrData;
   selEnrData: SelEnrData;
   mBrothData: MBrothData,
   vidasData: VidasData;
   controlsData: ControlsData,
   resultsData: ResultsData;
   wrapupData: WrapupData;
}

export interface PrepData {
   sampleReceived?: string;
   sampleReceivedFrom?: string;
   descriptionMatchesCR?: boolean;
   labelAttachmentType?: LabelAttachmentType;
   containerMatchesCR?: boolean;
   containerMatchesCRSignature?: Signature;
   codeMatchesCR?: boolean;
   codeMatchesCRNotes?: string;
   codeMatchesCRSignature?: Signature;
}

export interface PreEnrData {
   samplingMethod?: SamplingMethod;
   samplingMethodExceptionNotes?: string;
   balanceId?: string;
   blenderJarId?: string;
   bagId?: string;
   sampleSpike?: boolean;
   spikePlateCount?: number;
   preenrichMediumBatchId?: string;
   preenrichIncubatorId?: string;
   preenrichPositiveControlGrowth?: boolean;
   preenrichMediumControlGrowth?: boolean;
   preenrichSignature?: Signature;
}

export interface SelEnrData {
   rvBatchId?: string;
   ttBatchId?: string;
   bgBatchId?: string;
   l2KiBatchId?: string;
   rvttWaterBathId?: string;
   rvttSignature?: Signature;
}

export interface MBrothData {
   mBrothBatchId?: string;
   mBrothWaterBathId?: string;
   mBrothSignature?: Signature;
}

export interface VidasData {
   vidasInstrumentId?: string;
   vidasKitIds?: string[];
   vidasCompositesDetections?: boolean[];
   vidasPositiveControlDetection?: boolean;
   vidasMediumControlDetection?: boolean;
   vidasSpikeDetection?: boolean;
   vidasSignature?: Signature;
}

export interface ControlsData {
   systemControlsPositiveControlGrowth?: boolean;
   systemMediumPositiveControlGrowth?: boolean;
   systemControlsSignature?: Signature;
   collectorControlsPositveControlGrowth?: boolean;
   collectorControlsMediumControlGrowth?: boolean;
   collectorControlsSignature?: Signature;
   bacterialControlsUsed?: boolean;
   bacterialControlsSignature?: Signature;
}

export interface ResultsData {
   resultPositiveCompositesCount?: number;
   resultSignature?: Signature;
}

export interface WrapupData {
   reserveReserveSampleDisposition?: ReserveSampleDisposition;
   reserveSampleDestinations?: string[];
   reserveSampleNote?: string;
   allCompletedSignature?: Signature;
}

export type LabelAttachmentType = 'NONE' | 'ATTACHED_ORIGINAL' | 'ATTACHED_COPY' | 'SUBMITTED_ALONE';

export type ReserveSampleDisposition = 'NO_RESERVE_SAMPLE' | 'SAMPLE_DISCARDED_AFTER_ANALYSIS' | 'ISOLATES_SENT' | 'OTHER';

export function emptyTestData(): TestData {
   return {
      prepData: {},
      preEnrData: {},
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
   return statusForRequiredFieldValues([
      data.sampleReceived,
      data.sampleReceivedFrom,
      data.descriptionMatchesCR,
      data.labelAttachmentType,
      data.containerMatchesCR,
      data.containerMatchesCRSignature,
      data.codeMatchesCR,
      data.codeMatchesCRSignature
   ]);
}

function preEnrStatusCode(data: PreEnrData): FieldValuesStatusCode {
   const coreFieldsStatus = statusForRequiredFieldValues([
      data.samplingMethod,
      data.balanceId,
      data.blenderJarId,
      data.bagId,
      data.sampleSpike,
      data.preenrichMediumBatchId,
      data.preenrichIncubatorId,
      data.preenrichPositiveControlGrowth,
      data.preenrichMediumControlGrowth,
      data.preenrichSignature
   ]);

   // Spike plate count is required iff sampleSpike is true.
   if (coreFieldsStatus === 'c' && data.sampleSpike && !data.spikePlateCount) {
      return 'i';
   }
   return coreFieldsStatus;
}

function selEnrStatusCode(data: SelEnrData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.rvBatchId,
      data.ttBatchId,
      // data.bgBatchId,  TODO: Are these two required?
      // data.l2KiBatchId,
      data.rvttWaterBathId,
      data.rvttSignature,
   ]);
}

function mBrothStatusCode(data: MBrothData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.mBrothBatchId,
      data.mBrothWaterBathId,
      data.mBrothSignature,
   ]);
}

function vidasStatusCode(data: VidasData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.vidasInstrumentId,
      data.vidasKitIds,
      data.vidasCompositesDetections,
      data.vidasPositiveControlDetection,
      data.vidasMediumControlDetection,
      data.vidasSpikeDetection,
      data.vidasSignature,
   ]);
}

function controlsStatusCode(data: ControlsData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.systemControlsPositiveControlGrowth,
      data.systemMediumPositiveControlGrowth,
      data.systemControlsSignature,
      data.collectorControlsPositveControlGrowth,
      data.collectorControlsMediumControlGrowth,
      data.collectorControlsSignature,
      data.bacterialControlsUsed,
      data.bacterialControlsSignature,
   ]);
}

function resultsStatusCode(data: ResultsData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.resultPositiveCompositesCount,
      data.resultSignature,
   ]);
}

function wrapupStatusCode(data: WrapupData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.reserveReserveSampleDisposition,
      data.reserveSampleDestinations,
      data.allCompletedSignature,
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

