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
}

export interface SelEnrData {
   rvBatchId?: string | null;
   ttBatchId?: string | null;
   bgBatchId?: string | null;
   i2kiBatchId?: string | null;
   spikePlateCount?: number | null;
   rvttWaterBathId?: string | null;
   positiveControlGrowth?: boolean | null;
   mediumControlGrowth?: boolean | null;
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
   testUnitsContinuationTests: ContinuationTestssByTestUnitNum;
   continuationControls: ContinuationControls;
}

interface ContinuationTestssByTestUnitNum {
   [testUnitNum: string]: ContinuationTests;
}

export interface ContinuationTests
{
   rvSourcedTests: SelectiveAgarsTestSuite;
   ttSourcedTests: SelectiveAgarsTestSuite;
}

export interface ContinuationControls
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
   he: IsolateTestSequencesByUid;
   xld: IsolateTestSequencesByUid;
   bs24h: IsolateTestSequencesByUid;
   bs48h: IsolateTestSequencesByUid;
}

interface IsolateTestSequencesByUid { [testSeqUid: string]: IsolateTestSequence; }

export interface IsolateTestSequence {
   isolateNumber: number; // isolate number unique within the data for one test unit
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
   h2s: boolean | null;
   gas: boolean | null;
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

export function makeEmptyContinuationControls(username: string): ContinuationControls
{
   return {
      salmonellaGaminara: makeEmptySelectiveAgarsTestSuite(1, 1, username),
      salmonellaDiarizonae: makeEmptySelectiveAgarsTestSuite(1, 1, username),
      salmonellaControlsSatisfactory: null,
      pVulgarisApiVitekDetection: null,
      pVulgarisControlSatisfactory: null,
      pAerugiOxidaseDetection: null,
      pAerugiControlSatisfactory: null,
      medium: makeEmptySelectiveAgarsTestSuite(1, 1, username),
   };
}

export function makeEmptySelectiveAgarsTestSuite
   (
      firstIsolateNum: number,
      numIsolatesPerSelAgarPlate: number,
      username: string
   )
   : SelectiveAgarsTestSuite
{
   const now = new Date();
   return {
      he:    makeEmptyIsolateTestSequences(firstIsolateNum, numIsolatesPerSelAgarPlate, now, username),
      xld:   makeEmptyIsolateTestSequences(firstIsolateNum + numIsolatesPerSelAgarPlate, numIsolatesPerSelAgarPlate, now, username),
      bs24h: makeEmptyIsolateTestSequences(firstIsolateNum + 2 * numIsolatesPerSelAgarPlate, numIsolatesPerSelAgarPlate, now, username),
      bs48h: makeEmptyIsolateTestSequences(firstIsolateNum + 3 * numIsolatesPerSelAgarPlate, numIsolatesPerSelAgarPlate, now, username),
   };
}

export function countIsolates(selAgarsTestSuite: SelectiveAgarsTestSuite)
{
   let count = 0;

   for ( const selAgar of Object.keys(selAgarsTestSuite) )
      count += Object.keys(selAgarsTestSuite[selAgar]).length;

   return count;
}

function makeEmptyIsolateTestSequences
   (
      firstIsolateNum: number,
      numIsolates: number,
      timestamp: Date,
      username: string,
   )
   : IsolateTestSequencesByUid
{
   const seqs: IsolateTestSequencesByUid = {};

   for (let i = 0; i < numIsolates; ++i)
   {
      const uid = makeIsolateTestSequenceUid(timestamp, username, i + 1);
      seqs[uid] = makeEmptyIsolateTestSequence(firstIsolateNum + i);
   }

   return seqs;
}

export function makeEmptyIsolateTestSequence(isolateNum: number): IsolateTestSequence
{
   return {
      isolateNumber: isolateNum,
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

export function makeTestDataFormGroup(testData: TestData, username: string): FormGroup
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
      }),
      selEnrData: new FormGroup({
         rvBatchId: new FormControl(testData.selEnrData.rvBatchId),
         ttBatchId: new FormControl(testData.selEnrData.ttBatchId),
         bgBatchId: new FormControl(testData.selEnrData.bgBatchId),
         i2kiBatchId: new FormControl(testData.selEnrData.i2kiBatchId),
         spikePlateCount: new FormControl(testData.selEnrData.spikePlateCount),
         rvttWaterBathId: new FormControl(testData.selEnrData.rvttWaterBathId),
         positiveControlGrowth: new FormControl(testData.selEnrData.positiveControlGrowth),
         mediumControlGrowth: new FormControl(testData.selEnrData.mediumControlGrowth),
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
      posContData: makePositivesContinuationDataFormGroup(testData.posContData, username),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
}

export function makePositivesContinuationDataFormGroup(posContData: PositivesContinuationData | null, username: string): FormGroup
{
   const formValidatorFunctions = [];  // Put form-level validation here if any.

   if ( posContData == null )
      return new FormGroup({}, formValidatorFunctions);

   const testUnitsContinuationTests =
      makeTestUnitsContinuationTestsFormGroup(posContData.testUnitsContinuationTests || {});

   const continuationControls =
      makeContinuationControlsFormGroup(posContData.continuationControls || makeEmptyContinuationControls(username));

   return new FormGroup(
      {
         testUnitsContinuationTests,
         continuationControls
      },
      formValidatorFunctions
   );
}

export function makeTestUnitsContinuationTestsFormGroup(testUnitsContinuationTests: ContinuationTestssByTestUnitNum): FormGroup
{
   const fgControls: {[testUnitNum: string]: FormGroup} = {};

   for ( const testUnitNumStr of Object.keys(testUnitsContinuationTests) )
      fgControls[testUnitNumStr] = makeContinuationTestsFormGroup(testUnitsContinuationTests[testUnitNumStr]);

   return new FormGroup(fgControls);
}

// Make continuation testing form group for one test unit.
export function makeContinuationTestsFormGroup(contTests: ContinuationTests): FormGroup
{
   return new FormGroup({
      rvSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(contTests.rvSourcedTests),
      ttSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(contTests.ttSourcedTests),
   });
}

export function makeContinuationControlsFormGroup(contControls: ContinuationControls): FormGroup
{
   return new FormGroup({
      salmonellaGaminara: makeSelectiveAgarsTestSuiteFormGroup(contControls.salmonellaGaminara),
      salmonellaDiarizonae: makeSelectiveAgarsTestSuiteFormGroup(contControls.salmonellaDiarizonae),
      salmonellaControlsSatisfactory: new FormControl(contControls.salmonellaControlsSatisfactory),
      pVulgarisApiVitekDetection: new FormControl(contControls.pVulgarisApiVitekDetection),
      pVulgarisControlSatisfactory: new FormControl(contControls.pVulgarisControlSatisfactory),
      pAerugiOxidaseDetection: new FormControl(contControls.pAerugiOxidaseDetection),
      pAerugiControlSatisfactory: new FormControl(contControls.pAerugiControlSatisfactory),
      medium: makeSelectiveAgarsTestSuiteFormGroup(contControls.medium),
   });
}

function makeSelectiveAgarsTestSuiteFormGroup(selAgarsTestSuite: SelectiveAgarsTestSuite): FormGroup
{
   return new FormGroup({
      he: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.he),
      xld: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.xld),
      bs24h: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.bs24h),
      bs48h: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.bs48h),
   });
}

function makeIsolatesTestSequencesFormGroup(isolateTestSeqsByUid: IsolateTestSequencesByUid): FormGroup
{
   const fgControls: { [testSeqUid: string]: FormGroup } = {};

   for ( const testSeqUid of Object.keys(isolateTestSeqsByUid) )
      fgControls[testSeqUid] = makeIsolateTestSequenceFormGroup(isolateTestSeqsByUid[testSeqUid]);

   return new FormGroup(fgControls);
}

export function makeIsolateTestSequenceFormGroup(isolateTestSequence: IsolateTestSequence): FormGroup
{
   const fg = new FormGroup({
      isolateNumber: new FormControl(isolateTestSequence.isolateNumber),
      colonyAppearance: new FormControl(isolateTestSequence.colonyAppearance),
      tsiTubeTest: makeSlantTubeTestFormGroup(isolateTestSequence.tsiTubeTest),
      liaTubeTest: makeSlantTubeTestFormGroup(isolateTestSequence.liaTubeTest),
      oxidaseDetection: new FormControl(isolateTestSequence.oxidaseDetection),
      vitekDetection: new FormControl(isolateTestSequence.vitekDetection),
      api20eDetection: new FormControl(isolateTestSequence.api20eDetection),
      polyHAZ: new FormControl(isolateTestSequence.polyHAZ),
      polyAIPlusVi: new FormControl(isolateTestSequence.polyAIPlusVi),
      polyO: new FormControl(isolateTestSequence.polyO),
   });

   if ( isolateTestSequence.failure != null )
      fg.controls['failure'] = makeIsolateTestSequenceFailureFormGroup(isolateTestSequence.failure);

   return fg;
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
      data.positiveControlGrowth,
      data.mediumControlGrowth,
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
      posContTestUnitsStatusCode(positivesData.testUnitsContinuationTests, testData.vidasData, testConfig);

   const controlsStatus =
      contControlsStatusCode(positivesData.continuationControls, testConfig);

   return (
        testUnitsStatus === 'e' && controlsStatus === 'e' ? 'e'
      : testUnitsStatus === 'c' && controlsStatus === 'c' ? 'c'
      : 'i'
   );
}

function posContTestUnitsStatusCode
   (
      contTestss: ContinuationTestssByTestUnitNum,
      vidasData: VidasData,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   if ( !contTestss )
      return 'e';

   const testUnitNums = Object.keys(contTestss).map(numStr => parseInt(numStr)).sort();

   if ( testUnitNums.length === 0 )
      return 'e';

   // If the continuation test unit numbers aren't the same as the Vidas positives, then the data is considered incomplete.
   if ( !arraysEqual(testUnitNums, getVidasPositiveTestUnitNumbers(vidasData)) )
      return 'i';

   for ( const contTests of Object.values(contTestss) )
   {
      if ( !positiveTestUnitContinuationTestsComplete(contTests, testConfig) )
         return 'i';
   }

   return 'c';
}

function contControlsStatusCode
   (
      contControls: ContinuationControls | null,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   if ( contControls == null )
      return 'e';

   if ( contControls.salmonellaControlsSatisfactory    != null &&
        contControls.pVulgarisApiVitekDetection        != null &&
        contControls.pVulgarisControlSatisfactory      != null &&
        contControls.pAerugiOxidaseDetection           != null &&
        contControls.pAerugiControlSatisfactory        != null &&
        selectiveAgarsTestSuiteComplete(contControls.salmonellaGaminara, false, true, testConfig)  &&
        selectiveAgarsTestSuiteComplete(contControls.salmonellaDiarizonae, true, true, testConfig) &&
        selectiveAgarsTestSuiteComplete(contControls.medium, false, true, testConfig) )
      return 'c';

   return 'i';
}

function positiveTestUnitContinuationTestsComplete
   (
      contTests: ContinuationTests,
      testConfig: TestConfig | null
   )
   : boolean
{
   return (
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
   const minSelAgarsRequired = isControl ? testConfig && testConfig.positiveTestUnitControlsMinimumSelectiveAgars || 1 : 4;
   const minIsolatesPerSelAgar = isControl ? 1 : testConfig && testConfig.positiveTestUnitsMinimumIsolatesPerSelectiveAgar || 2;

   const heStatuses =
      Object.values(selAgarsTestSuite.he)
         .filter(testSeq => testSeq.failure == null)
         .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));
   const xldStatuses =
       Object.values(selAgarsTestSuite.xld)
       .filter(testSeq => testSeq.failure == null)
       .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));
   const bs24Statuses =
      Object.values(selAgarsTestSuite.bs24h)
      .filter(testSeq => testSeq.failure == null)
      .map(testSeq => isolateTestSequenceStatus(testSeq, onlySlantTubesRequired, testConfig));
   const bs48Statuses =
      Object.values(selAgarsTestSuite.bs48h)
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
      ( tsiTest.slant === 'K' && tsiTest.butt === 'K' && tsiTest.h2s === false && tsiTest.gas === false &&
        liaTest.slant === 'K' && liaTest.butt === 'K' && liaTest.h2s === false && liaTest.gas === false )
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

export function makeIsolateTestSequenceUid
   (
      timestamp: Date,
      userName: string,
      startSeqNum: number,
      uniquenessTestObj: { [key: string]: any } = null
   )
{
   const uidBase = timestamp.toISOString() + '|' + userName + '|';

   let seqNum = startSeqNum;
   let uid = uidBase + seqNum;

   if ( uniquenessTestObj )
   {
      while (uniquenessTestObj[uid] != null)
         uid = uidBase + (++seqNum);
   }

   return uid;
}
