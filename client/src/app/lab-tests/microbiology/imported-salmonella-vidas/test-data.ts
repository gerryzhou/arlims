import {Signature} from '../../../shared/models/signature';
import {FieldValuesStatusCode, stageNameToTestDataFieldName, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SamplingMethod} from '../sampling-method';


interface Stage {
   name: string;
   statusCodeFn: (any) => FieldValuesStatusCode;
}

const stages: Stage[] = [
   {name: 'PREP', statusCodeFn: prepStatusCode},
   {name: 'PRE-ENR', statusCodeFn: preEnrStatusCode},
   {name: 'SEL-ENR', statusCodeFn: selEnrStatusCode},
   {name: 'M-BROTH', statusCodeFn: mBrothStatusCode},
   {name: 'VIDAS', statusCodeFn:  vidasStatusCode},
   {name: 'CONTROLS', statusCodeFn: controlsStatusCode},
   {name: 'RESULTS', statusCodeFn: resultsStatusCode},
   {name: 'WRAPUP', statusCodeFn: wrapupStatusCode},
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
      data.codeMatchesCRNotes,
      data.codeMatchesCRSignature
   ]);
}

function preEnrStatusCode(data: PreEnrData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.samplingMethod,
      data.samplingMethodExceptionNotes,
      data.balanceId,
      data.blenderJarId,
      data.bagId,
      data.sampleSpike,
      data.spikePlateCount,
      data.preenrichMediumBatchId,
      data.preenrichIncubatorId,
      data.preenrichPositiveControlGrowth,
      data.preenrichMediumControlGrowth,
      data.preenrichSignature
   ]);
}

function selEnrStatusCode(data: SelEnrData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      data.rvBatchId,
      data.ttBatchId,
      data.bgBatchId,
      data.l2KiBatchId,
      data.rvttWaterBathId,
      data.rvttSignature,
   ]);
}

function mBrothStatusCode(data: MBrothData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      // TODO
   ]);
}
function vidasStatusCode(data: VidasData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      // TODO
   ]);
}
function controlsStatusCode(data: ControlsData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      // TODO
   ]);
}
function resultsStatusCode(data: ResultsData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      // TODO
   ]);
}
function wrapupStatusCode(data: WrapupData): FieldValuesStatusCode {
   return statusForRequiredFieldValues([
      // TODO
   ]);
}

function getStageStatuses(testData: TestData): TestStageStatus[] {
   return stages.map(stage => {
      const stageTestDataFieldName = stageNameToTestDataFieldName(stage.stageName);
      const stageData = testData[stageTestDataFieldName];
      return { stageName: stage.name, fieldValuesStatus: stage.statusCodeFn(stageData) };
   });
}


interface PrepData {
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

interface PreEnrData {
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

interface SelEnrData {
   rvBatchId?: string;
   ttBatchId?: string;
   bgBatchId?: string;
   l2KiBatchId?: string;
   rvttWaterBathId?: string;
   rvttSignature?: Signature;
}

interface MBrothData {
   mBrothBatchId?: string;
   mBrothWaterBathId?: string;
   mBrothSignature?: Signature;
}

interface VidasData {
   vidasInstrumentId?: string;
   vidasKitIds?: string[];
   vidasCompositesDetections?: boolean[];
   vidasPositiveControlDetection?: boolean;
   vidasMediumControlDetection?: boolean;
   vidasSpikeDetection?: boolean;
   vidasSignature?: Signature;
}

interface ControlsData {
   systemControlsPositiveControlGrowth?: boolean;
   systemMediumPositiveControlGrowth?: boolean;
   systemControlsSignature?: Signature;
   collectorControlsPositveControlGrowth?: boolean;
   collectorControlsMediumControlGrowth?: boolean;
   collectorControlsSignature?: Signature;
   bacterialControlsUsed?: boolean;
   bacterialControlsSignature?: Signature;
}

interface ResultsData {
   resultPositiveCompositesCount?: number;
   resultSignature?: Signature;
}

interface WrapupData {
   reserveReserveSampleDisposition?: ReserveSampleDisposition;
   reserveSampleDestinations?: string[];
   reserveSampleNote?: string;
   allCompletedSignature?: Signature;
}

export interface TestData {
   prepData:    PrepData;
   preEnrData:  PreEnrData;
   selEnrData:  SelEnrData;
   vidasData:   VidasData;
   resultsData: ResultsData;
}

export type LabelAttachmentType = 'NONE' | 'ATTACHED_ORIGINAL' | 'ATTACHED_COPY' | 'SUBMITTED_ALONE';

export type ReserveSampleDisposition = 'NO_RESERVE_SAMPLE' | 'SAMPLE_DISCARDED_AFTER_ANALYSIS' | 'ISOLATES_SENT' | 'OTHER';

export interface ImpSlmTestDataMergeResult {
   overwrittenFieldValuesCount: number;
}

export function emptyTestData(): TestData {
   return {
      prepData: {},
      preEnrData: {},
      selEnrData: {},
      vidasData: {},
      resultsData: {},
   };
}

