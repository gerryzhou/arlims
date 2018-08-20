import {FieldValuesStatusCode, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SampleTestUnits, SamplingMethod} from '../sampling-methods';

export interface TestData {
   prepData:     PrepData;
   preEnrData:   PreEnrData;
   selEnrData:   SelEnrData;
   mBrothData:   MBrothData;
   vidasData:    VidasData;
   controlsData: ControlsData;
   wrapupData:   WrapupData;
}

export interface PrepData {
   sampleReceivedDate?: string | null;
   sampleReceivedFrom?: string | null;
   descriptionMatchesCR?: boolean | null;
   descriptionMatchesCRNotes?: string | null;
   labelAttachmentType?: LabelAttachmentType | null;
   containerMatchesCR?: boolean | null;
   containerMatchesCRNotes?: string | null;
   codeMatchesCR?: boolean | null;
   codeMatchesCRNotes?: string | null;
}

export interface PreEnrData {
   samplingMethod?: SamplingMethod | null;
   samplingMethodExceptionsNotes?: string | null;
   balanceId?: string | null;
   blenderJarId?: string | null;
   bagId?: string | null;
   sampleSpike?: boolean | null;
   mediumBatchId?: string | null;
   mediumType?: string | null;
   incubatorId?: string | null;
   positiveControlGrowth?: boolean | null;
   mediumControlGrowth?: boolean | null;
}

export interface SelEnrData {
   rvBatchId?: string | null;
   ttBatchId?: string | null;
   bgBatchId?: string | null;
   i2kiBatchId?: string | null;
   spikePlateCount?: number | null;
   rvttWaterBathId?: string | null;
}

export interface MBrothData {
   mBrothBatchId?: string | null;
   mBrothWaterBathId?: string | null;
   waterBathStarted?: string | null;
}

export interface VidasData {
   instrumentId?: string | null;
   kitIds?: string | null;
   testUnitDetections?: boolean[] | null;
   positiveControlDetection?: boolean | null;
   mediumControlDetection?: boolean | null;
   spikeDetection?: boolean | null;
}

export interface ControlsData {
   systemControlsUsed?: boolean | null;
   systemControlTypes?: string | null;
   systemControlsGrowth?: boolean | null;
   collectorControlsUsed?: boolean | null;
   collectorControlTypes?: string | null;
   collectorControlsGrowth?: boolean | null;
   bacterialControlsUsed?: boolean | null;
}

export interface WrapupData {
   reserveSampleDisposition?: ReserveSampleDisposition | null;
   reserveSampleDestinations?: string | null;
   reserveSampleOtherDescription?: string | null;
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
      wrapupData: {},
   };
}

interface Stage {
   name: string;
   statusCodeFn: (TestData) => FieldValuesStatusCode;
}

export const TEST_STAGES: Stage[] = [
   {name: 'PREP',     statusCodeFn: prepStatusCode},
   {name: 'PRE-ENR',  statusCodeFn: preEnrStatusCode},
   {name: 'SEL-ENR',  statusCodeFn: selEnrStatusCode},
   {name: 'M-BROTH',  statusCodeFn: mBrothStatusCode},
   {name: 'VIDAS',    statusCodeFn: vidasStatusCode},
   {name: 'CONTROLS', statusCodeFn: controlsStatusCode},
   {name: 'WRAPUP',   statusCodeFn: wrapupStatusCode},
];

function prepStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.prepData;

   const reqStatus = statusForRequiredFieldValues([
      data.sampleReceivedDate,
      data.sampleReceivedFrom,
      data.descriptionMatchesCR,
      // (descriptionMatchesCRNotes is not required)
      data.labelAttachmentType,
      data.containerMatchesCR,
      // (containerMatchesCRNotes is not required)
      data.codeMatchesCR,
      // (codeMatchesCRNotes is not required)
   ]);

   if (reqStatus === 'e') return (data.descriptionMatchesCRNotes || data.containerMatchesCRNotes || data.codeMatchesCR) ? 'i' : 'e';
   else return reqStatus;
}

function preEnrStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.preEnrData;

   // Check unconditional top-level fields.
   const uncondTopLevelFieldsStatus = statusForRequiredFieldValues([
      data.balanceId,
      data.blenderJarId,
      data.bagId,
      data.sampleSpike,
      data.mediumBatchId,
      data.mediumType,
      data.incubatorId,
      data.positiveControlGrowth,
      data.mediumControlGrowth,
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

   return (
      uncondTopLevelFieldsStatus === 'i' || samplingMethodFieldsStatus === 'i' ? 'i'
         : uncondTopLevelFieldsStatus === 'c' && (samplingMethodFieldsStatus !== 'c') ? 'i'
         : uncondTopLevelFieldsStatus === 'e' && (samplingMethodFieldsStatus !== 'e') ? 'i'
         : uncondTopLevelFieldsStatus
   );
}

function selEnrStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.selEnrData;

   const uncondTopLevelFieldsStatus = statusForRequiredFieldValues([
      data.rvBatchId,
      data.ttBatchId,
      data.bgBatchId,
      data.i2kiBatchId,
      data.rvttWaterBathId,
   ]);

   const spiking = testData.preEnrData && !!testData.preEnrData.sampleSpike;
   const spikeCountPresent = !!data.spikePlateCount;

   return (
      uncondTopLevelFieldsStatus === 'i' ? 'i'
         : uncondTopLevelFieldsStatus === 'c' && spiking && !spikeCountPresent ? 'i'
         : uncondTopLevelFieldsStatus === 'e' && spikeCountPresent ? 'i'
            : uncondTopLevelFieldsStatus
   );
}

function mBrothStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.mBrothData;
   return statusForRequiredFieldValues([
      data.mBrothBatchId,
      data.mBrothWaterBathId,
      data.waterBathStarted,
   ]);
}

function vidasStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.vidasData;
   return statusForRequiredFieldValues([
      data.instrumentId,
      data.kitIds,
      data.testUnitDetections,
      data.positiveControlDetection,
      data.mediumControlDetection,
      data.spikeDetection,
   ]);
}

function controlsStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.controlsData;

   const usageFieldsStatus = statusForRequiredFieldValues([
      data.systemControlsUsed,
      data.collectorControlsUsed,
      data.bacterialControlsUsed,
   ]);

   switch ( usageFieldsStatus  )
   {
      case 'i': return 'i';
      case 'e': return 'e';
      case 'c':
      {
         if (data.systemControlsUsed &&
            (!data.systemControlTypes || data.systemControlTypes.trim().length === 0 || data.systemControlsGrowth == null))
         {
            return 'i';
         }
         if (data.collectorControlsUsed &&
            (!data.collectorControlTypes || data.collectorControlTypes.trim().length === 0 || data.collectorControlsGrowth == null))
         {
            return 'i';
         }

         return 'c';
      }
   }
}

function wrapupStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.wrapupData;

   if (!data.reserveSampleDisposition) return 'e';

   if (data.reserveSampleDisposition === 'OTHER' && isEmptyString(data.reserveSampleOtherDescription)) return 'i';

   if (data.reserveSampleDisposition  === 'ISOLATES_SENT' && isEmptyString(data.reserveSampleDestinations)) return 'i';

   return 'c';
}

export function getTestStageStatuses(testData: TestData): TestStageStatus[]
{
   return TEST_STAGES.map(stage => ({
         stageName: stage.name,
         fieldValuesStatus: stage.statusCodeFn(testData)
   }));
}

export function firstNonCompleteTestStageName(testData: TestData): string | null
{
   for (const stage of TEST_STAGES)
   {
      if (stage.statusCodeFn(testData) !== 'c') return stage.name;
   }
   return null;
}

export function isEmptyString(s: string)
{
   return !s || s.trim().length === 0;
}

