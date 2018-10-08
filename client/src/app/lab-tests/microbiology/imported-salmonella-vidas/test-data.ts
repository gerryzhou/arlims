import {countValueOccurrences, FieldValuesStatusCode, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SamplingMethod} from '../sampling-methods';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

export interface TestData {
   prepData:     PrepData;
   preEnrData:   PreEnrData;
   selEnrData:   SelEnrData;
   mBrothData:   MBrothData;
   vidasData:    VidasData;
   controlsData: ControlsData;
   posContData: PositivesContinuationData;
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

export interface PositivesContinuationData
{
   positiveTestUnitContinuations: PositiveTestUnitContinuationTests[];
}

export interface PositiveTestUnitContinuationTests
{
   positiveTestUnitNumber: number;
   rvSourcedTests: SelectiveAgarsTestSuite;
   ttSourcedTests: SelectiveAgarsTestSuite;
   conclusionSalmonellaDetected: boolean;
}

export interface SelectiveAgarsTestSuite {
   he: SelectiveAgarTests;
   xld: SelectiveAgarTests;
   bs_24h: SelectiveAgarTests;
   bs_48h: SelectiveAgarTests;
}

export interface SelectiveAgarTests {
   colonyAppearance: 'T' | 'AT'| 'NT'| 'NG';
   isolateTests: IsolateTestSequence[];
}

export interface IsolateTestSequence {
   // colonyAppearance: 'T' | 'AT'| 'NT'| 'NG' | null;
   tsiTubeTest: SlantTubeTest;
   liaTubeTest: SlantTubeTest;
   // ureaDetection: boolean; // TODO
   oxidaseDetection: boolean;
   vitekDetection: boolean;
   api20eDetection: boolean;
   serologyTest: SerologyTest;
}

export interface SlantTubeTest {
   slant: string;
   butt: string;
   h2s: string;
   gas: string;
}

export interface SerologyTest {
   polyHAZ: string;
   polyAIPlusVi: string;
   polyO: string;
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
      posContData: {positiveTestUnitContinuations: []},
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
         waterBathStarted: new FormControl(testData.mBrothData.waterBathStarted),
      }),
      vidasData: new FormGroup({
         instrumentId: new FormControl(testData.vidasData.instrumentId),
         kitIds: new FormControl(testData.vidasData.kitIds),
         testUnitDetections: new FormArray(
            (testData.vidasData.testUnitDetections || [null])
               .map(detected => new FormControl(detected))
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
      posContData: new FormGroup( {
         continuationTests: new FormArray(
            (testData.posContData.positiveTestUnitContinuations || [])
               .map(makePositiveTestUnitContinuationTestsFormGroup)
         ),
      }),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
}

// Make continuation testing form group for one positive test unit.
function makePositiveTestUnitContinuationTestsFormGroup(posContTests: PositiveTestUnitContinuationTests): FormGroup
{
   return new FormGroup({
      positiveTestUnitNumber: new FormControl(posContTests.positiveTestUnitNumber),
      rvSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(posContTests.rvSourcedTests),
      ttSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(posContTests.ttSourcedTests),
      conclusionSalmonellaDetected: new FormControl(posContTests.conclusionSalmonellaDetected),
   });
}

function makeSelectiveAgarsTestSuiteFormGroup(selAgarsTestSuite: SelectiveAgarsTestSuite): FormGroup
{
   return new FormGroup({
      he: makeSelectiveAgarTestsFormGroup(selAgarsTestSuite.he),
      xld: makeSelectiveAgarTestsFormGroup(selAgarsTestSuite.xld),
      bs_24h: makeSelectiveAgarTestsFormGroup(selAgarsTestSuite.bs_24h),
      bs_48h: makeSelectiveAgarTestsFormGroup(selAgarsTestSuite.bs_48h),
   });
}

function makeSelectiveAgarTestsFormGroup(selAgarTests: SelectiveAgarTests): FormGroup
{
   return new FormGroup({
      colonyAppearance: new FormControl(selAgarTests.colonyAppearance),
      isolateTests: new FormArray(
         (selAgarTests.isolateTests || [])
            .map(makeIsolateTestSequenceFormGroup)
      ),
   });
}

function makeIsolateTestSequenceFormGroup(isolateTestSequence: IsolateTestSequence): FormGroup
{
   return new FormGroup({
      tsiTubeTest: makeSlantTubeTestFormGroup(isolateTestSequence.tsiTubeTest),
      liaTubeTest: makeSlantTubeTestFormGroup(isolateTestSequence.liaTubeTest),
      // ureaDetection: new FormControl(isolateTestSequence.ureaDetection), // TODO
      oxidaseDetection: new FormControl(isolateTestSequence.oxidaseDetection),
      vitekDetection: new FormControl(isolateTestSequence.vitekDetection),
      api20eDetection: new FormControl(isolateTestSequence.api20eDetection),
      serologyTest: makeSerologyFormGroup(isolateTestSequence.serologyTest),
   });
}

function makeSlantTubeTestFormGroup(slantTubeTest: SlantTubeTest): FormGroup
{
   return new FormGroup({
      slant: new FormControl(slantTubeTest.slant),
      butt: new FormControl(slantTubeTest.butt),
      h2s: new FormControl(slantTubeTest.h2s),
      gas: new FormControl(slantTubeTest.gas),
   });
}

function makeSerologyFormGroup(serologyTest: SerologyTest): FormGroup
{
   return new FormGroup({
      polyHAZ: new FormControl(serologyTest.polyHAZ),
      polyAIPlusVi: new FormControl(serologyTest.polyAIPlusVi),
      polyO: new FormControl(serologyTest.polyO),
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
   {name: 'POS-CONT', statusCodeFn: posContStatusCode},
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

function posContStatusCode(testData: TestData): FieldValuesStatusCode
{
   const positivesData = testData.posContData;
   if ( !positivesData.positiveTestUnitContinuations || positivesData.positiveTestUnitContinuations.length === 0 )
      return 'e';

   const vidasPositives = countValueOccurrences(testData.vidasData.testUnitDetections, true);
   if ( vidasPositives !== positivesData.positiveTestUnitContinuations.length )
      return 'i';

   for ( const contTests of positivesData.positiveTestUnitContinuations )
   {
      if ( !positiveTestUnitContinuationTestsComplete(contTests) )
         return 'i';
   }

   return 'c';
}

function positiveTestUnitContinuationTestsComplete(contTests: PositiveTestUnitContinuationTests): boolean
{
   return (
      selectiveAgarsTestSuiteComplete(contTests.rvSourcedTests) &&
      selectiveAgarsTestSuiteComplete(contTests.ttSourcedTests) &&
      contTests.conclusionSalmonellaDetected != null &&
      contTests.positiveTestUnitNumber != null
   );
}

function selectiveAgarsTestSuiteComplete(selAgarsTestSuite: SelectiveAgarsTestSuite): boolean
{
   return (
      selectiveAgarTestsComplete(selAgarsTestSuite.he) &&
      selectiveAgarTestsComplete(selAgarsTestSuite.xld) &&
      selectiveAgarTestsComplete(selAgarsTestSuite.bs_24h) &&
      selectiveAgarTestsComplete(selAgarsTestSuite.bs_48h)
   );
}

function selectiveAgarTestsComplete(selAgarTests: SelectiveAgarTests): boolean
{
   if ( selAgarTests.colonyAppearance === 'NT' || selAgarTests.colonyAppearance === 'NG' )
     return true;

   if ( selAgarTests.isolateTests.length < 2 )
      return false;

   for ( const isolateTestSeq of selAgarTests.isolateTests )
   {
      if (!isolateTestSequenceComplete(isolateTestSeq))
         return false;
   }

   return true;
}

function isolateTestSequenceComplete(isolate: IsolateTestSequence): boolean
{
   // Nothing else to be done if some slant tube result patterns occur.
   const tsiComplete = slantTubeTestComplete(isolate.tsiTubeTest);
   const liaComplete = slantTubeTestComplete(isolate.liaTubeTest);
   if ( tsiComplete && isSlantTubeStopPattern(isolate.tsiTubeTest) ||
        liaComplete && isSlantTubeStopPattern(isolate.liaTubeTest) )
      return true;

   if ( !tsiComplete || !liaComplete )
      return false;

   // TODO: Urea test ?

   // Nothing else needs to be done if oxidase test yields positive.
   if ( isolate.oxidaseDetection === true )
      return true;

   // Require at least one of vitek and api tests.
   if ( isolate.vitekDetection == null && isolate.api20eDetection == null )
      return false;

   // If neither of vitek and api tests are positive, no more testing is needed.
   if ( !isolate.vitekDetection && !isolate.api20eDetection )
      return true;

   if ( !serologyTestComplete(isolate.serologyTest) )
      return false;

   // TODO: PFGE, WGS (shown in workflow)?

   return true;
}

function isSlantTubeStopPattern(slantTest: SlantTubeTest): boolean
{
   return false;  // TODO
}

function slantTubeTestComplete(slantTest: SlantTubeTest): boolean
{
   return (
      slantTest.slant != null &&
      slantTest.butt != null &&
      slantTest.h2s != null &&
      slantTest.gas != null
   );
}

function serologyTestComplete(serologyTest: SerologyTest): boolean
{
   return (
     serologyTest.polyHAZ != null &&
     serologyTest.polyAIPlusVi != null &&
     serologyTest.polyO != null
   );
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

