import {FormArray, FormControl, FormGroup} from '@angular/forms';

import {FieldValuesStatusCode, statusForRequiredFieldValues, TestStageStatus} from '../../test-stages';
import {SamplingMethod} from '../sampling-methods';
import {arraysEqual} from '../../../shared/util/data-objects';
import {TestConfig} from './test-config';

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
   controls: PositivesContinuationControlsData;
}

export interface PositiveTestUnitContinuationTests
{
   testUnitNumber: number | null;
   rvSourcedTests: SelectiveAgarsTestSuite;
   ttSourcedTests: SelectiveAgarsTestSuite;
}

export interface PositivesContinuationControlsData
{
   salmonellaGaminara: SelectiveAgarsTestSuite;
   salmonellaDiarizonae: SelectiveAgarsTestSuite;
   salmonellaControlsSatisfactory: boolean | null;
   pVulgarisApiVitekDetection: boolean | null;
   pVulgarisControlSatisfactory: boolean | null;
   pAerugiOxidaseDetection: boolean | null;
   pAerugiControlSatisfactory: boolean | null;
   medium: SelectiveAgarsTestSuite;
}

export interface SelectiveAgarsTestSuite {
   he: IsolateTestSequence[];
   xld: IsolateTestSequence[];
   bs24h: IsolateTestSequence[];
   bs48h: IsolateTestSequence[];
}

export interface IsolateTestSequence {
   colonyAppearance: ColonyAppearance | null;
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

export interface WrapupData {
   reserveSampleDisposition?: ReserveSampleDisposition | null;
   reserveSampleDestinations?: string | null;
   reserveSampleOtherDescription?: string | null;
}

export type ColonyAppearance = 'T' | 'AT'| 'NT'| 'NG';

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
      posContData: null,
      wrapupData: {},
   };
}

export function makeEmptyPositivesContinuationControls(): PositivesContinuationControlsData
{
   return {
      salmonellaGaminara: makeEmptySelectiveAgarsTestSuite(1),
      salmonellaDiarizonae: makeEmptySelectiveAgarsTestSuite(1),
      salmonellaControlsSatisfactory: null,
      pVulgarisApiVitekDetection: null,
      pVulgarisControlSatisfactory: null,
      pAerugiOxidaseDetection: null,
      pAerugiControlSatisfactory: null,
      medium: makeEmptySelectiveAgarsTestSuite(1),
   };
}

export function makeEmptySelectiveAgarsTestSuite(numIsolates: number): SelectiveAgarsTestSuite
{
   return {
      he:    makeEmptyIsolateTestSequences(numIsolates),
      xld:   makeEmptyIsolateTestSequences(numIsolates),
      bs24h: makeEmptyIsolateTestSequences(numIsolates),
      bs48h: makeEmptyIsolateTestSequences(numIsolates),
   };
}

function makeEmptyIsolateTestSequences(numIsolates: number)
{
   return Array.from(Array(numIsolates), makeEmptyIsolateTestSequence);
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
      posContData: makePositivesContinuationDataFormGroup(testData.posContData),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
}

export function makePositivesContinuationDataFormGroup(posContData: PositivesContinuationData | null): FormGroup
{
   const formValidatorFunctions = [];  // Put form-level validation here if any.

   if ( posContData == null )
      return new FormGroup({}, formValidatorFunctions);

   const positiveTestUnitContinuationTestss =
      makePositiveTestUnitContinuationTestssFormArray(posContData.positiveTestUnitContinuationTestss || []);

   const controls =
      makePositivesContinuationControlsFormGroup(posContData.controls || makeEmptyPositivesContinuationControls());

   return new FormGroup({ positiveTestUnitContinuationTestss, controls }, formValidatorFunctions);
}

export function makePositiveTestUnitContinuationTestssFormArray(posTestUnitContTestss: PositiveTestUnitContinuationTests[])
{
   return new FormArray(
      posTestUnitContTestss.map(
         makePositiveTestUnitContinuationTestsFormGroup
      )
   );
}

// Make continuation testing form group for one positive test unit.
export function makePositiveTestUnitContinuationTestsFormGroup(posContTests: PositiveTestUnitContinuationTests): FormGroup
{
   return new FormGroup({
      testUnitNumber: new FormControl(posContTests.testUnitNumber),
      rvSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(posContTests.rvSourcedTests),
      ttSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(posContTests.ttSourcedTests),
   });
}

export function makePositivesContinuationControlsFormGroup(posContControlsData: PositivesContinuationControlsData): FormGroup
{
   return new FormGroup({
      salmonellaGaminara: makeSelectiveAgarsTestSuiteFormGroup(posContControlsData.salmonellaGaminara),
      salmonellaDiarizonae: makeSelectiveAgarsTestSuiteFormGroup(posContControlsData.salmonellaDiarizonae),
      salmonellaControlsSatisfactory: new FormControl(posContControlsData.salmonellaControlsSatisfactory),
      pVulgarisApiVitekDetection: new FormControl(posContControlsData.pVulgarisApiVitekDetection),
      pVulgarisControlSatisfactory: new FormControl(posContControlsData.pVulgarisControlSatisfactory),
      pAerugiOxidaseDetection: new FormControl(posContControlsData.pAerugiOxidaseDetection),
      pAerugiControlSatisfactory: new FormControl(posContControlsData.pAerugiControlSatisfactory),
      medium: makeSelectiveAgarsTestSuiteFormGroup(posContControlsData.medium),
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

export function makeIsolateTestSequenceFailureFormGroup(failure: IsolateTestSequenceFailure)
{
   return new FormGroup({
      declaredAt: new FormControl(failure.declaredAt),
      reason: new FormControl(failure.reason),
      notes: new FormControl(failure.notes),
   });
}

interface Stage {
   name: string;
   statusCodeFn: (TestData, TestConfig) => FieldValuesStatusCode;
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

function posContStatusCode(testData: TestData, testConfig: TestConfig | null): FieldValuesStatusCode
{
   const positivesData = testData.posContData;
   if ( positivesData == null )
      return 'e';

   const testUnitsStatus =
      posContTestUnitsStatusCode(positivesData.positiveTestUnitContinuationTestss, testData.vidasData, testConfig);

   const controlsStatus =
      posContControlsStatusCode(positivesData.controls, testConfig);

   return (
        testUnitsStatus === 'e' && controlsStatus === 'e' ? 'e'
      : testUnitsStatus === 'c' && controlsStatus === 'c' ? 'c'
      : 'i'
   );
}

function posContTestUnitsStatusCode
   (
      contTestss: PositiveTestUnitContinuationTests[],
      vidasData: VidasData,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   if ( !contTestss || contTestss.length === 0 )
      return 'e';

   // If the continuation test unit numbers aren't the same as the Vidas positives, then the data is considered incomplete.
   const contTestUnitNums = contTestss.map(contTests => contTests.testUnitNumber);
   if ( !arraysEqual(contTestUnitNums, getVidasPositiveTestUnitNumbers(vidasData)) )
      return 'i';

   for ( const contTests of contTestss )
   {
      if ( !positiveTestUnitContinuationTestsComplete(contTests, testConfig) )
         return 'i';
   }

   return 'c';
}

function posContControlsStatusCode
   (
      controls: PositivesContinuationControlsData | null,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   if ( controls == null )
      return 'e';

   if ( controls.salmonellaControlsSatisfactory    != null &&
        controls.pVulgarisApiVitekDetection        != null &&
        controls.pVulgarisControlSatisfactory      != null &&
        controls.pAerugiOxidaseDetection           != null &&
        controls.pAerugiControlSatisfactory        != null &&
        selectiveAgarsTestSuiteComplete(controls.salmonellaGaminara, false, true, testConfig)  &&
        selectiveAgarsTestSuiteComplete(controls.salmonellaDiarizonae, true, true, testConfig) &&
        selectiveAgarsTestSuiteComplete(controls.medium, false, true, testConfig) )
      return 'c';

   return 'i';
}

function positiveTestUnitContinuationTestsComplete
   (
      contTests: PositiveTestUnitContinuationTests,
      testConfig: TestConfig | null
   )
   : boolean
{
   return (
      contTests.testUnitNumber != null &&
      selectiveAgarsTestSuiteComplete(contTests.rvSourcedTests, false, false, testConfig) &&
      selectiveAgarsTestSuiteComplete(contTests.ttSourcedTests, false, false, testConfig)
   );
}

function selectiveAgarsTestSuiteComplete
   (
      selAgarsTestSuite: SelectiveAgarsTestSuite,
      onlySlantTubesRequired = false,
      isControl = false,
      testConfig: TestConfig | null
   )
   : boolean
{
   const minSelAgarsRequired = isControl ? testConfig.positiveTestUnitControlsMinimumSelectiveAgars || 1 : 4;
   const minIsolatesPerSelAgar = isControl ? 1 : testConfig.positiveTestUnitsMinimumIsolatesPerSelectiveAgar || 2;

   const heStatuses =
      selAgarsTestSuite.he
         .filter(testSeq => testSeq.failure == null)
         .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));
   const xldStatuses =
       selAgarsTestSuite.xld
       .filter(testSeq => testSeq.failure == null)
       .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));
   const bs24Statuses =
      selAgarsTestSuite.bs24h
      .filter(testSeq => testSeq.failure == null)
      .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));
   const bs48Statuses =
      selAgarsTestSuite.bs48h
         .filter(testSeq => testSeq.failure == null)
         .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));

   let completeSelAgars = 0;

   const heComplete = heStatuses.length >= minIsolatesPerSelAgar && heStatuses.every(status => status === 'c');
   const heEmpty = heStatuses.every(status => status === 'e');
   if ( !heComplete && !heEmpty ) return false;
   if ( heComplete ) completeSelAgars += 1;

   const xldComplete = xldStatuses.length >= minIsolatesPerSelAgar && xldStatuses.every(status => status === 'c');
   const xldEmpty = xldStatuses.every(status => status === 'e');
   if ( !xldComplete && !xldEmpty ) return false;
   if ( xldComplete ) completeSelAgars += 1;

   const bs24Complete = bs24Statuses.length >= minIsolatesPerSelAgar && bs24Statuses.every(status => status === 'c');
   const bs24Empty = bs24Statuses.every(status => status === 'e');
   if ( !bs24Complete && !bs24Empty ) return false;
   if ( bs24Complete ) completeSelAgars += 1;

   const bs48Complete = bs48Statuses.length >= minIsolatesPerSelAgar && bs48Statuses.every(status => status === 'c');
   const bs48Empty = bs48Statuses.every(status => status === 'e');
   if ( !bs48Complete && !bs48Empty ) return false;
   if ( bs48Complete ) completeSelAgars += 1;

   return completeSelAgars >= minSelAgarsRequired;
}

function isolateTestSequenceStatus
   (
      testSeq: IsolateTestSequence,
      onlySlantTubesRequired = false,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   if ( testSeq.colonyAppearance === 'NT' || testSeq.colonyAppearance === 'NG' )
      return testSeq.failure == null ? 'i' : 'c';

   const tsiStatus = slantTubeTestStatus(testSeq.tsiTubeTest);
   const liaStatus = slantTubeTestStatus(testSeq.liaTubeTest);

   if ( tsiStatus === 'e' &&
        liaStatus === 'e' &&
        testSeq.oxidaseDetection == null &&
        testSeq.vitekDetection   == null &&
        testSeq.api20eDetection  == null &&
        testSeq.polyHAZ          == null &&
        testSeq.polyAIPlusVi     == null &&
        testSeq.polyO            == null )
      return 'e';

   if ( tsiStatus === 'c' && liaStatus === 'c' )
   {
      if ( onlySlantTubesRequired )
         return 'c';

      if ( slantTubeResultsMixed(testSeq.tsiTubeTest, testSeq.liaTubeTest) )
         return testSeq.failure == null ? 'i' : 'c';

      if ( testSeq.oxidaseDetection === true )
         return 'c';
      if ( testSeq.oxidaseDetection == null )
         return 'i';

      if ( testSeq.vitekDetection == null && testSeq.api20eDetection == null )
         return 'i';

      if ( !testSeq.vitekDetection && !testSeq.api20eDetection )
         return 'c';

      if ( testConfig.positivesContinuationTestingSerologyRequired )
         return testSeq.polyHAZ != null && testSeq.polyAIPlusVi != null && testSeq.polyO != null ? 'c' : 'i';

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

function slantTubeResultsMixed(tsiTest: SlantTubeTest, liaTest): boolean
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

export function getTestStageStatuses(testData: TestData, testConfig: TestConfig | null): TestStageStatus[]
{
   return TEST_STAGES.map(stage => ({
         stageName: stage.name,
         fieldValuesStatus: stage.statusCodeFn(testData, testConfig)
   }));
}

export function firstNonCompleteTestStageName(testData: TestData, testConfig: TestConfig | null): string | null
{
   for (const stage of TEST_STAGES)
   {
      if (stage.statusCodeFn(testData, testConfig) !== 'c') return stage.name;
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

