import {FieldValuesStatusCode, statusForRequiredFieldValues, TestStageStatus} from '../../../test-stages';
import {
   ContinuationControls,
   ContinuationTests,
   ContinuationTestssByTestUnitNum, IsolateIdentification, IsolateTestSequence,
   SelectiveAgarsTestSuite, SlantTubeTest,
   TestData,
   VidasData
} from './types';
import {TestConfig} from '../test-config';
import {arraysEqual} from '../../../../shared/util/data-objects';

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
   {name: 'SLANT',    statusCodeFn: slantStatusCode},
   {name: 'IDENT',    statusCodeFn: identStatusCode},
   {name: 'WRAPUP',   statusCodeFn: wrapupStatusCode},
];

type PosContStageName = 'SLANT' | 'IDENT';

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
            data.samplingMethod.testUnitsType,
            data.samplingMethod.testUnitsCount,
            data.samplingMethod.numberOfSubsPerComposite,
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
      data.systemControlsGrowth,
      data.collectorControlsGrowth,
      data.bacterialControlsUsed,
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

export function vidasStatusCode(testData: TestData): FieldValuesStatusCode
{
   const data = testData.vidasData;
   const spiking = spikingSpecified(testData);

   const reqFieldsStatus =
       statusForRequiredFieldValues(
          [
             data.instrumentId,
             data.kitIds,
             data.testUnitDetections,
             data.positiveControlDetection,
             data.mediumControlDetection,
          ].concat(spiking ? [data.spikeDetection] : [])
       );

   if ( reqFieldsStatus === 'e' && data.methodRemarks != null )
      return 'i';
   else
      return reqFieldsStatus;
}

function slantStatusCode
   (
      testData: TestData,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   return posContStatusCode('SLANT', testData, testConfig);
}

function identStatusCode
(
   testData: TestData,
   testConfig: TestConfig | null
)
   : FieldValuesStatusCode
{
   return posContStatusCode('IDENT', testData, testConfig);
}

function posContStatusCode
   (
      stage: PosContStageName,
      testData: TestData,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   const positivesData = testData.posContData;
   if ( positivesData == null )
      return 'e';

   const testUnitsStatus =
      posContTestUnitsStatusCode(stage, positivesData.testUnitsContinuationTests, testData.vidasData, testConfig);

   const controlsStatus =
      contControlsStatusCode(stage, positivesData.continuationControls, testConfig);

   return (
      testUnitsStatus === 'e' && controlsStatus === 'e' ? 'e'
         : testUnitsStatus === 'c' && controlsStatus === 'c' ? 'c'
         : 'i'
   );
}

function posContTestUnitsStatusCode
   (
      stage: PosContStageName,
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
      if ( !positiveTestUnitContinuationTestsComplete(stage, contTests, testConfig) )
         return 'i';
   }

   return 'c';
}

function contControlsStatusCode
   (
      stage: PosContStageName,
      contControls: ContinuationControls | null,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   if ( contControls == null )
      return 'e';

   switch (stage)
   {
      case 'SLANT':
         return (
            contControls.pAerugiOxidaseDetection != null &&
            contControls.pVulgarisUreaDetection != null &&
            contControls.mediumControlGrowth != null &&
            selectiveAgarsTestSuiteComplete(stage, contControls.salmonellaGaminara, false, true, testConfig)  &&
            selectiveAgarsTestSuiteComplete(stage, contControls.salmonellaDiarizonae, true, true, testConfig)
         ) ? 'c' : 'i';
      case 'IDENT':
         return (
            contControls.salmonellaGaminaraSatisfactory   != null &&
            contControls.salmonellaDiarizonaeSatisfactory != null &&
            contControls.pVulgarisSatisfactory            != null &&
            contControls.pAerugiSatisfactory              != null &&
            contControls.mediumControlGrowth              != null &&
            contControls.mediumSatisfactory               != null &&
            isolateIdentificationStatus(contControls.pVulgarisIdentification) === 'c' &&
            selectiveAgarsTestSuiteComplete(stage, contControls.salmonellaGaminara, false, true, testConfig)  &&
            selectiveAgarsTestSuiteComplete(stage, contControls.salmonellaDiarizonae, true, true, testConfig)
         ) ? 'c' : 'i';
   }
}

function positiveTestUnitContinuationTestsComplete
   (
      stage: PosContStageName,
      contTests: ContinuationTests,
      testConfig: TestConfig | null
   )
   : boolean
{
   return (
      selectiveAgarsTestSuiteComplete(stage, contTests.rvSourcedTests, false, false, testConfig) &&
      selectiveAgarsTestSuiteComplete(stage, contTests.ttSourcedTests, false, false, testConfig)
   );
}

function selectiveAgarsTestSuiteComplete
   (
      stage: PosContStageName,
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
         .map(testSeq => isolateTestSequenceStatus(stage, testSeq, onlySlantTubesRequired, testConfig));
   const xldStatuses =
      Object.values(selAgarsTestSuite.xld)
         .filter(testSeq => testSeq.failure == null)
         .map(testSeq => isolateTestSequenceStatus(stage, testSeq, onlySlantTubesRequired, testConfig));
   const bs24Statuses =
      Object.values(selAgarsTestSuite.bs24h)
         .filter(testSeq => testSeq.failure == null)
         .map(testSeq => isolateTestSequenceStatus(stage, testSeq, onlySlantTubesRequired, testConfig));
   const bs48Statuses =
      Object.values(selAgarsTestSuite.bs48h)
         .filter(testSeq => testSeq.failure == null)
         .map(testSeq => isolateTestSequenceStatus(stage, testSeq, onlySlantTubesRequired, testConfig));

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
      stage: PosContStageName,
      testSeq: IsolateTestSequence,
      onlySlantTubesRequired = false,
      testConfig: TestConfig | null
   )
   : FieldValuesStatusCode
{
   const { slantStageStatus, identRequired } =
      isolateTestSequenceSlantStageState(testSeq, onlySlantTubesRequired, testConfig);

   if ( stage === 'SLANT' )
      return slantStageStatus;

   const identStatus = isolateIdentificationStatus(testSeq.identification);

   if ( !identRequired ) return identStatus;
   else return identStatus === 'c' ? 'c' : 'i';
}

interface IsolateTestSeqSlantStageState {
   slantStageStatus: FieldValuesStatusCode;
   identRequired: boolean;
}

function isolateTestSequenceSlantStageState
   (
      testSeq: IsolateTestSequence,
      onlySlantTubesRequired = false,
      testConfig: TestConfig | null
   )
   : IsolateTestSeqSlantStageState
{
   if ( testSeq.colonyAppearance === 'NT' || testSeq.colonyAppearance === 'NG' )
      return { slantStageStatus: testSeq.failure == null ? 'i' : 'c', identRequired: false};

   const tsiStatus = slantTubeTestStatus(testSeq.tsiTubeTest);
   const liaStatus = slantTubeTestStatus(testSeq.liaTubeTest);

   // Check for empty.
   if ( tsiStatus === 'e' && liaStatus === 'e' && testSeq.ureaDetection == null && testSeq.oxidaseDetection == null )
      return { slantStageStatus: 'e', identRequired: false};

   if ( tsiStatus === 'c' && liaStatus === 'c' )
   {
      if ( slantTubeResultsMixed(testSeq.tsiTubeTest, testSeq.liaTubeTest) )
         return { slantStageStatus: testSeq.failure == null ? 'i' : 'c', identRequired: false};

      if ( onlySlantTubesRequired )
         return { slantStageStatus: 'c', identRequired: false};

      // TODO: Urea detection implies completion here?

      if ( testSeq.oxidaseDetection === true )
         return { slantStageStatus: 'c', identRequired: false};
      if ( testSeq.oxidaseDetection == null )
         return { slantStageStatus: 'i', identRequired: false};

      return { slantStageStatus: 'c', identRequired: true};
   }
   else
      return { slantStageStatus: 'i', identRequired: false};
}

function slantTubeTestStatus(slantTest: SlantTubeTest): FieldValuesStatusCode
{
   if ( slantTest.slant == null && slantTest.butt == null && slantTest.h2s == null && slantTest.gas == null )
      return 'e';
   else if ( slantTest.slant != null && slantTest.butt != null && slantTest.h2s != null && slantTest.gas != null )
      return 'c';
   else return 'i';
}

function isolateIdentificationStatus(ident: IsolateIdentification)
{
   if ( ident == null ||
        ident.identCode == null && ident.identText == null && ident.attachmentLabel == null )
      return 'e';
   else if ( ident.identCode != null && ident.identText != null )
      return 'c';
   else return 'i';
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

   let reqFieldsStatus;

   if ( !data.reserveSampleDisposition )
      reqFieldsStatus = 'e';
   else if ( data.reserveSampleDisposition === 'OTHER' &&
             isEmptyString(data.reserveSampleOtherDescription) )
      reqFieldsStatus = 'i';
   else if ( data.reserveSampleDisposition  === 'ISOLATES_SENT' &&
             isEmptyString(data.reserveSampleDestinations) )
      reqFieldsStatus = 'i';
   else
      reqFieldsStatus = 'c';

   if ( reqFieldsStatus === 'e' )
      return data.analysisResultsRemarksText == null ? 'e' : 'i';
   else
      return reqFieldsStatus;
}

export function getTestStageStatuses
   (
      testData: TestData,
      testConfig: TestConfig | null
   )
   : TestStageStatus[]
{
   return TEST_STAGES.map(stage => ({
      stageName: stage.name,
      fieldValuesStatus: stage.statusCodeFn(testData, testConfig)
   }));
}

export function firstNonCompleteTestStageName
   (
      testData: TestData,
      testConfig: TestConfig | null
   )
   : string | null
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
