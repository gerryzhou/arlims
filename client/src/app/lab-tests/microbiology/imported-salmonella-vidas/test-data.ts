import {FormArray, FormControl, FormGroup} from '@angular/forms';

import {FieldValuesStatusCode, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SamplingMethod} from '../sampling-methods';
import {arraysEqual} from '../../../shared/util/data-objects';

export interface TestData {
   prepData:     PrepData;
   preEnrData:   PreEnrData;
   selEnrData:   SelEnrData;
   mBrothData:   MBrothData;
   vidasData:    VidasData;
   controlsData: ControlsData;
   posContData:  PositivesContinuationData;
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
   positiveTestUnitContinuationTestss: PositiveTestUnitContinuationTests[];
   controls: PositivesContinuationControlsData | null;
}

export interface PositiveTestUnitContinuationTests
{
   positiveTestUnitNumber: number | null;
   rvSourcedTests: SelectiveAgarsTestSuite;
   ttSourcedTests: SelectiveAgarsTestSuite;
}

export interface SelectiveAgarsTestSuite {
   he: IsolateTestSequence[];
   xld: IsolateTestSequence[];
   bs24h: IsolateTestSequence[];
   bs48h: IsolateTestSequence[];
}

export interface IsolateTestSequence {
   colonyAppearance: 'T' | 'AT'| 'NT'| 'NG' | null;
   tsiTubeTest: SlantTubeTest;
   liaTubeTest: SlantTubeTest;
   oxidaseDetection?: boolean | null;
   vitekDetection?: boolean | null;
   api20eDetection?: boolean | null;
   polyHAZ?: string | null;
   polyAIPlusVi?: string | null;
   polyO?: string | null;

   failure?: IsolateTestSequenceFailure | null;
}

export interface SlantTubeTest {
   slant: string | null;
   butt: string | null;
   h2s: string | null;
   gas: string | null;
}

export interface IsolateTestSequenceFailure {
   declaredAt: string;
   reason: string;
   notes: string | null;
}

export interface PositivesContinuationControlsData
{
   salmonellaGaminara: IsolateTestSequence;
   salmonellaDiarizonae: IsolateTestSequence;
   salmonellaControlsSatisfactory: boolean | null;
   pVulgarisApiVitekDetection: boolean | null;
   pVulgarisControlSatisfactory: boolean | null;
   pAerugiOxidaseDetection: boolean | null;
   pAerugiControlSatisfactory: boolean | null;
   mediumControl: IsolateTestSequence;
}

export interface WrapupData {
   reserveSampleDisposition?: ReserveSampleDisposition | null;
   reserveSampleDestinations?: string | null;
   reserveSampleOtherDescription?: string | null;
}

export type LabelAttachmentType = 'NONE' | 'ATTACHED_ORIGINAL' | 'ATTACHED_COPY' | 'SUBMITTED_ALONE';

export type ReserveSampleDisposition = 'NO_RESERVE_SAMPLE' | 'SAMPLE_DISCARDED_AFTER_ANALYSIS' | 'ISOLATES_SENT' | 'OTHER';

// Empty test data should define all fields necessary to reach the leaf data elements
// which are bound to form controls, other than the leaf data elements themselves.
export function emptyTestData(): TestData {
   return {
      prepData: {},
      preEnrData: {
         samplingMethod: {}
      },
      selEnrData: {},
      mBrothData: {},
      vidasData: {},
      controlsData: {},
      posContData: { positiveTestUnitContinuationTestss: [], controls: null },
      wrapupData: {},
   };
}

export function makeEmptyPositivesContinuationControls(): PositivesContinuationControlsData
{
   return {
      salmonellaGaminara: makeEmptyIsolateTestSequence(),
      salmonellaDiarizonae: makeEmptyIsolateTestSequence(),
      salmonellaControlsSatisfactory: null,
      pVulgarisApiVitekDetection: null,
      pVulgarisControlSatisfactory: null,
      pAerugiOxidaseDetection: null,
      pAerugiControlSatisfactory: null,
      mediumControl: makeEmptyIsolateTestSequence()
   };
}

export function makeEmptyIsolateTestSequence(): IsolateTestSequence
{
   return {
      colonyAppearance: null,
      tsiTubeTest: makeEmptySlantTubeTest(),
      liaTubeTest: makeEmptySlantTubeTest(),
   };
}

export function makeEmptySlantTubeTest(): SlantTubeTest
{
   return {
      slant: null,
      butt: null,
      h2s: null,
      gas: null,
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
      posContData: makePosContDataFormGroup(testData),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
}

// Omit the controls part of the form group if not present in test data. It will be set
// programmatically as needed.
function makePosContDataFormGroup(testData: TestData)
{
   const positiveTestUnitContinuationTestss = new FormArray(
      (testData.posContData.positiveTestUnitContinuationTestss || [])
         .map(makePositiveTestUnitContinuationTestsFormGroup)
   );

   if ( testData.posContData.controls != null )
      return new FormGroup({
         positiveTestUnitContinuationTestss,
         controls: makePositivesContinuationControlsFormGroup(testData.posContData.controls),
      });
   else
      return new FormGroup({ positiveTestUnitContinuationTestss });
}

export function makePositivesContinuationControlsFormGroup(posContControlsData: PositivesContinuationControlsData): FormGroup
{
   return new FormGroup({
      salmonellaGaminara: makeIsolateTestSequenceFormGroup(posContControlsData.salmonellaGaminara),
      salmonellaDiarizonae: makeIsolateTestSequenceFormGroup(posContControlsData.salmonellaDiarizonae),
      salmonellaControlsSatisfactory: new FormControl(posContControlsData.salmonellaControlsSatisfactory),
      pVulgarisApiVitekDetection: new FormControl(posContControlsData.pVulgarisApiVitekDetection),
      pVulgarisControlSatisfactory: new FormControl(posContControlsData.pVulgarisControlSatisfactory),
      pAerugiOxidaseDetection: new FormControl(posContControlsData.pAerugiOxidaseDetection),
      pAerugiControlSatisfactory: new FormControl(posContControlsData.pAerugiControlSatisfactory),
      mediumControl: makeIsolateTestSequenceFormGroup(posContControlsData.mediumControl),
   });
}

// Make continuation testing form group for one positive test unit.
export function makePositiveTestUnitContinuationTestsFormGroup(posContTests: PositiveTestUnitContinuationTests): FormGroup
{
   return new FormGroup({
      positiveTestUnitNumber: new FormControl(posContTests.positiveTestUnitNumber),
      rvSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(posContTests.rvSourcedTests),
      ttSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(posContTests.ttSourcedTests),
   });
}

function makeSelectiveAgarsTestSuiteFormGroup(selAgarsTestSuite: SelectiveAgarsTestSuite): FormGroup
{
   return new FormGroup({
      he: makeIsolateTestSequencesFormArray(selAgarsTestSuite.he),
      xld: makeIsolateTestSequencesFormArray(selAgarsTestSuite.xld),
      bs24h: makeIsolateTestSequencesFormArray(selAgarsTestSuite.bs24h),
      bs48h: makeIsolateTestSequencesFormArray(selAgarsTestSuite.bs48h),
   });
}

function makeIsolateTestSequencesFormArray(isolateTests: IsolateTestSequence[]): FormArray
{
   return new FormArray(isolateTests.map(makeIsolateTestSequenceFormGroup));
}

export function makeIsolateTestSequenceFormGroup(isolateTestSequence: IsolateTestSequence): FormGroup
{
   return new FormGroup({
      colonyAppearance: new FormControl(isolateTestSequence.colonyAppearance),
      tsiTubeTest: makeSlantTubeTestFormGroup(isolateTestSequence.tsiTubeTest),
      liaTubeTest: makeSlantTubeTestFormGroup(isolateTestSequence.liaTubeTest),
      oxidaseDetection: new FormControl(isolateTestSequence.oxidaseDetection),
      vitekDetection: new FormControl(isolateTestSequence.vitekDetection),
      api20eDetection: new FormControl(isolateTestSequence.api20eDetection),
      polyHAZ: new FormControl(isolateTestSequence.polyHAZ),
      polyAIPlusVi: new FormControl(isolateTestSequence.polyAIPlusVi),
      polyO: new FormControl(isolateTestSequence.polyO),
      // The failure structure is omitted, will be inserted programmatically as needed.
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

interface Stage {
   name: string;
   statusCodeFn: (TestData) => FieldValuesStatusCode;
}

// This structure defines the test stage names and their status computations,
// used to generate the stage statuses to be stored with the test data for
// general display. Other parts of the program will use these stage names
// as routing param to route to a particular test stage within the test.
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
            return 'i';

         if (data.collectorControlsUsed &&
            (!data.collectorControlTypes || data.collectorControlTypes.trim().length === 0 || data.collectorControlsGrowth == null))
            return 'i';

         return 'c';
      }
   }
}

function posContStatusCode(testData: TestData): FieldValuesStatusCode
{
   const positivesData = testData.posContData;
   if ( positivesData == null )
      return 'e';

   const testUnitsStatus = posContTestUnitsStatusCode(positivesData.positiveTestUnitContinuationTestss, testData.vidasData);

   const controlsStatus = posContControlsStatusCode(positivesData.controls);

   return (
        testUnitsStatus === 'e' && controlsStatus === 'e' ? 'e'
      : testUnitsStatus === 'c' && controlsStatus === 'c' ? 'c'
      : 'i'
   );
}

function posContTestUnitsStatusCode(contTestss: PositiveTestUnitContinuationTests[], vidasData: VidasData): FieldValuesStatusCode
{
   if ( !contTestss || contTestss.length === 0 )
      return 'e';

   // If the continuation test unit numbers aren't the same as the Vidas positives, then the data is considered incomplete.
   const contTestUnitNums = contTestss.map(contTests => contTests.positiveTestUnitNumber);
   if ( !arraysEqual(contTestUnitNums, getVidasPositiveTestUnitNumbers(vidasData)) )
      return 'i';

   for ( const contTests of contTestss )
   {
      if ( !positiveTestUnitContinuationTestsComplete(contTests) )
         return 'i';
   }

   return 'c';
}

function posContControlsStatusCode(controls: PositivesContinuationControlsData): FieldValuesStatusCode
{
   const salmonellaGaminaraStatus =
      isolateTestSequenceStatus(controls.salmonellaGaminara, false, true);
   const salmonellaDiarizonaeStatus =
      isolateTestSequenceStatus(controls.salmonellaDiarizonae, true, true);
   const mediumControlStatus =
      isolateTestSequenceStatus(controls.mediumControl, false, true);

   if ( salmonellaGaminaraStatus === 'e' &&
        salmonellaDiarizonaeStatus === 'e' &&
        controls.salmonellaControlsSatisfactory == null &&
        controls.pVulgarisApiVitekDetection     == null &&
        controls.pVulgarisControlSatisfactory   == null &&
        controls.pAerugiOxidaseDetection        == null &&
        controls.pAerugiControlSatisfactory     == null &&
        mediumControlStatus === 'e' )
      return 'e';

   if ( salmonellaGaminaraStatus === 'c' &&
        salmonellaDiarizonaeStatus === 'c' &&
        controls.salmonellaControlsSatisfactory != null &&
        controls.pVulgarisApiVitekDetection     != null &&
        controls.pVulgarisControlSatisfactory   != null &&
        controls.pAerugiOxidaseDetection        != null &&
        controls.pAerugiControlSatisfactory     != null &&
        mediumControlStatus === 'c' )
      return 'c';

   return 'i';
}

function positiveTestUnitContinuationTestsComplete(contTests: PositiveTestUnitContinuationTests): boolean
{
   return (
      contTests.positiveTestUnitNumber != null &&
      selectiveAgarsTestSuiteComplete(contTests.rvSourcedTests) &&
      selectiveAgarsTestSuiteComplete(contTests.ttSourcedTests)
   );
}

function selectiveAgarsTestSuiteComplete(selAgarsTestSuite: SelectiveAgarsTestSuite): boolean
{
   const minTestSeqsPerSelAgar = 2; // TODO: Need param passed from lab group config here.

   return (
      isolateTestsComplete(selAgarsTestSuite.he, minTestSeqsPerSelAgar)     &&
      isolateTestsComplete(selAgarsTestSuite.xld, minTestSeqsPerSelAgar)    &&
      isolateTestsComplete(selAgarsTestSuite.bs24h, minTestSeqsPerSelAgar) &&
      isolateTestsComplete(selAgarsTestSuite.bs48h, minTestSeqsPerSelAgar)
   );
}

function isolateTestsComplete(isolateTestSeqs: IsolateTestSequence[], minTestSeqs: number): boolean
{
   const nonFailedTestSeqs = isolateTestSeqs.filter(testSeq => testSeq.failure == null);

   if ( nonFailedTestSeqs.length < minTestSeqs )
      return false;

   for ( const isolateTestSeq of nonFailedTestSeqs )
   {
      if (isolateTestSequenceStatus(isolateTestSeq) !== 'c')
         return false;
   }

   return true;
}

function isolateTestSequenceStatus(isolate: IsolateTestSequence, onlySlantTubesRequired = false, isControl = false): FieldValuesStatusCode
{
   if ( !isControl && (isolate.colonyAppearance === 'NT' || isolate.colonyAppearance === 'NG') )
      return 'c';

   const tsiStatus = slantTubeTestStatus(isolate.tsiTubeTest);
   const liaStatus = slantTubeTestStatus(isolate.liaTubeTest);

   if ( tsiStatus === 'e' &&
        liaStatus === 'e' &&
        isolate.oxidaseDetection == null &&
        isolate.vitekDetection   == null &&
        isolate.api20eDetection  == null &&
        isolate.polyHAZ          == null &&
        isolate.polyAIPlusVi     == null &&
        isolate.polyO            == null )
      return 'e';

   if ( tsiStatus === 'c' && liaStatus === 'c' )
   {
      if ( onlySlantTubesRequired ||
           !isControl && isSlantTubesStopConditionSatisfied(isolate.tsiTubeTest, isolate.liaTubeTest) )
         return 'c';

      if ( !isControl && isolate.oxidaseDetection === true )
         return 'c';
      if ( isolate.oxidaseDetection == null )
         return 'i';

      if ( isolate.vitekDetection == null && isolate.api20eDetection == null )
         return 'i';
      if ( !isControl && !isolate.vitekDetection && !isolate.api20eDetection )
         return 'c';

      // TODO: Need param from lab group config here to determine whether serology is required (not required for now).
      // if ( serologyRequired)
      //    return isolate.polyHAZ != null && isolate.polyAIPlusVi != null && isolate.polyO != null ? 'c' : 'i';
      return 'c';
   }
   else
      return 'i';
}

function slantTubeTestStatus(slantTest: SlantTubeTest): FieldValuesStatusCode
{
   if ( slantTest.slant == null && slantTest.butt == null && slantTest.h2s == null && slantTest.gas == null )
      return 'e';
   if ( slantTest.slant != null && slantTest.butt != null && slantTest.h2s != null && slantTest.gas != null )
      return 'c';
   return 'i';
}

function isSlantTubesStopConditionSatisfied(tsiTest: SlantTubeTest, liaTest): boolean
{
   return (
      ( tsiTest.slant === 'A' && tsiTest.butt === 'A' &&
        liaTest.slant === 'K' && liaTest.butt === 'A' ) ||
      (liaTest.slant === 'R') ||
      ( tsiTest.slant === 'K' && tsiTest.butt === 'K' && tsiTest.h2s === 'neg' && tsiTest.gas === 'neg' &&
        liaTest.slant === 'K' && liaTest.butt === 'K' && liaTest.h2s === 'neg' && liaTest.gas === 'neg' )
   );
}

function wrapupStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.wrapupData;

   if (!data.reserveSampleDisposition)
      return 'e';

   if (data.reserveSampleDisposition === 'OTHER' && isEmptyString(data.reserveSampleOtherDescription))
      return 'i';

   if (data.reserveSampleDisposition  === 'ISOLATES_SENT' && isEmptyString(data.reserveSampleDestinations))
      return 'i';

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

export function getVidasPositiveTestUnitNumbers(vidasData: VidasData): number[]
{
   if ( vidasData == null || vidasData.testUnitDetections == null )
      return [];

   const positives: number[] = [];
   const detections = vidasData.testUnitDetections;

   for (let i = 0; i < detections.length; ++i)
   {
      if ( detections[i] === true )
         positives.push(i + 1);
   }

   return positives;
}

export function isEmptyString(s: string)
{
   return !s || s.trim().length === 0;
}

