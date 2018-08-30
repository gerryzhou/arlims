import {FieldValuesStatusCode, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SampleTestUnits, SamplingMethod} from '../sampling-methods';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

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

export function makeTestDataFormGroup(testData: TestData): FormGroup
{
   return new FormGroup({
      prepData: new FormGroup({
         sampleReceivedDate: new FormControl(testData.prepData.sampleReceivedDate),
         sampleReceivedFrom: new FormControl(testData.prepData.sampleReceivedFrom),
         descriptionMatchesCR: new FormControl(testData.prepData.descriptionMatchesCR),
         descriptionMatchesCRNotes: new FormControl(testData.prepData.descriptionMatchesCRNotes),
         labelAttachmentType: new FormControl(testData.prepData.labelAttachmentType),
         containerMatchesCR: new FormControl(testData.prepData.containerMatchesCR),
         containerMatchesCRNotes: new FormControl(testData.prepData.containerMatchesCRNotes),
         codeMatchesCR: new FormControl(testData.prepData.codeMatchesCR),
         codeMatchesCRNotes: new FormControl(testData.prepData.codeMatchesCRNotes),
      }),
      preEnrData: new FormGroup({
         samplingMethod: new FormGroup({
            numberOfComposites: new FormControl(testData.preEnrData.samplingMethod.numberOfComposites),
            numberOfSubsPerComposite: new FormControl(testData.preEnrData.samplingMethod.numberOfSubsPerComposite),
            extractedGramsPerSub: new FormControl(testData.preEnrData.samplingMethod.extractedGramsPerSub),
            numberOfSubs: new FormControl(testData.preEnrData.samplingMethod.numberOfSubs),
            compositeMassGrams: new FormControl(testData.preEnrData.samplingMethod.compositeMassGrams),
         }),
         samplingMethodExceptionsNotes: new FormControl(testData.preEnrData.samplingMethodExceptionsNotes),

         balanceId: new FormControl(testData.preEnrData.balanceId),
         blenderJarId: new FormControl(testData.preEnrData.blenderJarId),
         bagId: new FormControl(testData.preEnrData.bagId),
         mediumBatchId: new FormControl(testData.preEnrData.mediumBatchId),
         mediumType: new FormControl(testData.preEnrData.mediumType),
         incubatorId: new FormControl(testData.preEnrData.incubatorId),

         sampleSpike: new FormControl(testData.preEnrData.sampleSpike),
         positiveControlGrowth: new FormControl(testData.preEnrData.positiveControlGrowth),
         mediumControlGrowth: new FormControl(testData.preEnrData.mediumControlGrowth),
      }),
      selEnrData: new FormGroup({
         rvBatchId: new FormControl(testData.selEnrData.rvBatchId),
         ttBatchId: new FormControl(testData.selEnrData.ttBatchId),
         bgBatchId: new FormControl(testData.selEnrData.bgBatchId),
         i2kiBatchId: new FormControl(testData.selEnrData.i2kiBatchId),
         spikePlateCount: new FormControl(testData.selEnrData.spikePlateCount),
         rvttWaterBathId: new FormControl(testData.selEnrData.rvttWaterBathId),
      }),
      mBrothData: new FormGroup({
         mBrothBatchId: new FormControl(testData.mBrothData.mBrothBatchId),
         mBrothWaterBathId: new FormControl(testData.mBrothData.mBrothWaterBathId),
         waterBathStarted: new FormControl(testData.mBrothData.waterBathStarted), // TODO: Add ISO timestamp validator.
      }),
      vidasData: new FormGroup({
         instrumentId: new FormControl(testData.vidasData.instrumentId),
         kitIds: new FormControl(testData.vidasData.kitIds),
         testUnitDetections: new FormArray(
            (testData.vidasData.testUnitDetections || [null]).map(detected => new FormControl(detected))
         ),
         positiveControlDetection: new FormControl(testData.vidasData.positiveControlDetection),
         mediumControlDetection: new FormControl(testData.vidasData.mediumControlDetection),
         spikeDetection: new FormControl(testData.vidasData.spikeDetection),
      }),
      controlsData: new FormGroup({
         systemControlsUsed: new FormControl(testData.controlsData.systemControlsUsed),
         systemControlTypes: new FormControl(testData.controlsData.systemControlTypes),
         systemControlsGrowth: new FormControl(testData.controlsData.systemControlsGrowth),
         collectorControlsUsed: new FormControl(testData.controlsData.collectorControlsUsed),
         collectorControlTypes: new FormControl(testData.controlsData.collectorControlTypes),
         collectorControlsGrowth: new FormControl(testData.controlsData.collectorControlsGrowth),
         bacterialControlsUsed: new FormControl(testData.controlsData.bacterialControlsUsed),
      }),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
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

function spikingSpecified(testData: TestData) {
   return testData.preEnrData && !!testData.preEnrData.sampleSpike;
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
   const spiking = spikingSpecified(testData);
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
   const spiking = spikingSpecified(testData);
   return statusForRequiredFieldValues(
      [
          data.instrumentId,
          data.kitIds,
          data.testUnitDetections,
          data.positiveControlDetection,
          data.mediumControlDetection,
      ]
      .concat(spiking ? [data.spikeDetection] : [])
   );
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

