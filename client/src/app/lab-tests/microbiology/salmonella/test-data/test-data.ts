import * as moment from 'moment';

import {SamplingMethod} from '../../sampling-methods';
import {TimeChargeStatusCode} from '../../../../../generated/dto';

export interface TestData {
   prepData:     PrepData;
   preEnrData:   PreEnrData;
   selEnrData:   SelEnrData;
   mBrothData:   MBrothData;
   vidasData:    VidasData;
   posContData:  PositivesContinuationData;
   wrapupData:   WrapupData;
}

export interface PrepData {
   sampleReceivedDate: string | null;
   sampleReceivedDateEntered: string | null;
   sampleReceivedFrom: string | null;
   descriptionMatchesCR: boolean | null;
   descriptionMatchesCRNotes: string | null;
   labelAttachmentType: LabelAttachmentType | null;
   containerMatchesCR: boolean | null;
   containerMatchesCRNotes: string | null;
   codeMatchesCR: boolean | null;
   codeMatchesCRNotes: string | null;
}

export interface PreEnrData {
   samplingMethod: SamplingMethod | null;
   samplingMethodExceptionsNotes: string | null;
   balanceId: string | null;
   blenderJarId: string | null;
   bagId: string | null;
   sampleSpike: boolean | null;
   spikeSpeciesText: string | null;
   spikeKitRemarks: string | null;
   mediumBatchId: string | null;
   mediumType: string | null;
   incubatorId: string | null;
}

export interface SelEnrData {
   rvBatchId: string | null;
   ttBatchId: string | null;
   bgBatchId: string | null;
   i2kiBatchId: string | null;
   spikePlateCount: number | null;
   rvttWaterBathId: string | null;
   positiveControlGrowth: boolean | null;
   mediumControlGrowth: boolean | null;
   systemControlsGrowth: 'G' | 'NG' | 'NA' | null;
   systemControlTypes: string | null;
   collectorControlsGrowth: 'G' | 'NG' | 'NA' | null;
   collectorControlTypes: string | null;
   bacterialControlsUsed: boolean | null;
}

export interface MBrothData {
   mBrothBatchId: string | null;
   mBrothWaterBathId: string | null;
   waterBathStarted: string | null;
}

export interface VidasData {
   instrumentId: string | null;
   kitIds: string | null;
   testUnitDetections: boolean[] | null;
   positiveControlDetection: boolean | null;
   positiveControlDetectionEntered: string | null;
   mediumControlDetection: boolean | null;
   spikeDetection: boolean | null;
   methodRemarks: string | null;
}

export interface PositivesContinuationData
{
   // These fields Should be both present or both absent.
   testUnitsContinuationTests?: ContinuationTestssByTestUnitNum;
   continuationControls?: ContinuationControls;
}

export interface ContinuationTestssByTestUnitNum {
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
   salmonellaGaminaraSatisfactory: boolean | null;
   salmonellaDiarizonae: SelectiveAgarsTestSuite;
   salmonellaDiarizonaeSatisfactory: boolean | null;
   pVulgarisUreaDetection: boolean | null;
   pVulgarisIdentification: IsolateIdentification;
   pVulgarisSatisfactory: boolean | null;
   pAerugiOxidaseDetection: boolean| null;
   pAerugiSatisfactory: boolean | null;
   mediumControlGrowth: boolean | null;
   mediumSatisfactory: boolean | null;
}

export interface SelectiveAgarsTestSuite {
   he: IsolateTestSequencesByUid;
   xld: IsolateTestSequencesByUid;
   bs24h: IsolateTestSequencesByUid;
   bs48h: IsolateTestSequencesByUid;
}

export interface IsolateTestSequencesByUid { [testSeqUid: string]: IsolateTestSequence; }

export interface IsolateTestSequence {
   isolateNumber: number; // isolate number unique within the data for one test unit
   colonyAppearance: ColonyAppearance | null;
   tsiTubeTest: SlantTubeTest;
   liaTubeTest: SlantTubeTest;
   ureaDetection: boolean | null;
   oxidaseDetection: boolean | null;
   identification?: IsolateIdentification | null;
   failure?: IsolateTestSequenceFailure | null;
}

export type IdentificationMethod = 'API20E' | 'Vitek';

export interface SlantTubeTest {
   slant: string | null;
   butt: string | null;
   h2s: boolean | null;
   gas: boolean | null;
}

export interface IsolateIdentification
{
   method: IdentificationMethod | null;
   identCode: string | null;
   identText: string | null;
   attachmentLabel: string | null;
}

export interface IsolateTestSequenceFailure {
   declaredAt: string;
   reason: string;
   notes: string | null;
}

export interface WrapupData {
   reserveSampleDisposition: ReserveSampleDisposition | null;
   reserveSampleDestinations: string | null;
   reserveSampleOtherDescription: string | null;
   testTimeCharges: TimeChargesSet;
   timeChargesLastSavedToFacts: string | null;
   timeChargesLastEdited: string | null;
   analysisResultsRemarks: string | null;
}

export interface TimeChargesSet {
   [userShortName: string]: TimeCharge;
}

export interface TimeCharge {
   role: TimeChargeRole;
   hours: number;
   assignmentStatus: TimeChargeStatusCode;
   enteredTimestamp: string;
}

export type TimeChargeRole = 'lead' | 'additional' | 'check'; // display text for analyst type codes

export type ColonyAppearance = 'T' | 'AT'| 'NT'| 'NG';

export type LabelAttachmentType = 'NONE' | 'ATTACHED_ORIGINAL' | 'ATTACHED_COPY' | 'SUBMITTED_ALONE';

export type ReserveSampleDisposition = 'NO_RESERVE_SAMPLE' | 'SAMPLE_DISCARDED_AFTER_ANALYSIS' | 'ISOLATES_SENT' | 'OTHER';


// Empty test data should define all fields necessary to reach the leaf data elements
// which are bound to form controls, other than the leaf data elements themselves.
export function emptyTestData(): TestData {
   return {
      prepData: {
         sampleReceivedDate: null,
         sampleReceivedDateEntered: null,
         sampleReceivedFrom: null,
         descriptionMatchesCR: null,
         descriptionMatchesCRNotes: null,
         labelAttachmentType: null,
         containerMatchesCR: null,
         containerMatchesCRNotes: null,
         codeMatchesCR: null,
         codeMatchesCRNotes: null
      },
      preEnrData: {
         samplingMethod: {
            name: null,
            description: null,
            testUnitsType: null,
            testUnitsCount: null,
            extractedGramsPerSub: null,
            numberOfSubsPerComposite: null,
            userModifiable: null
         },
         samplingMethodExceptionsNotes: null,
         balanceId: null,
         blenderJarId: null,
         bagId: null,
         sampleSpike: null,
         spikeSpeciesText: null,
         spikeKitRemarks: null,
         mediumBatchId: null,
         mediumType: null,
         incubatorId: null
      },
      selEnrData: {
         rvBatchId: null,
         ttBatchId: null,
         bgBatchId: null,
         i2kiBatchId: null,
         spikePlateCount: null,
         rvttWaterBathId: null,
         positiveControlGrowth: null,
         mediumControlGrowth: null,
         systemControlsGrowth: null,
         systemControlTypes: null,
         collectorControlsGrowth: null,
         collectorControlTypes: null,
         bacterialControlsUsed: null
      },
      mBrothData: {
         mBrothBatchId: null,
         mBrothWaterBathId: null,
         waterBathStarted: null
      },
      vidasData: {
         instrumentId: null,
         kitIds: null,
         testUnitDetections: null,
         positiveControlDetection: null,
         positiveControlDetectionEntered: null,
         mediumControlDetection: null,
         spikeDetection: null,
         methodRemarks: null
      },
      posContData: {},
      wrapupData: {
         reserveSampleDisposition: null,
         reserveSampleDestinations: null,
         reserveSampleOtherDescription: null,
         testTimeCharges: {},
         timeChargesLastSavedToFacts: null,
         timeChargesLastEdited: null,
         analysisResultsRemarks: null,
      },
   };
}

export function makeEmptyContinuationControls(): ContinuationControls
{
   return {
      salmonellaGaminara: makeEmptySelectiveAgarsTestSuite(1, 1),
      salmonellaGaminaraSatisfactory: null,
      salmonellaDiarizonae: makeEmptySelectiveAgarsTestSuite(1, 1),
      salmonellaDiarizonaeSatisfactory: null,
      pVulgarisUreaDetection: null,
      pVulgarisIdentification: makeEmptyIsolateIdentification(),
      pVulgarisSatisfactory: null,
      pAerugiOxidaseDetection: null,
      pAerugiSatisfactory: null,
      mediumControlGrowth: null,
      mediumSatisfactory: null,
   };
}

export function makeEmptySelectiveAgarsTestSuite
   (
      firstIsolateNum: number,
      numIsolatesPerSelAgarPlate: number
   )
   : SelectiveAgarsTestSuite
{
   return {
      he:    makeEmptyIsolateTestSequences(firstIsolateNum, numIsolatesPerSelAgarPlate),
      xld:   makeEmptyIsolateTestSequences(firstIsolateNum + numIsolatesPerSelAgarPlate, numIsolatesPerSelAgarPlate),
      bs24h: makeEmptyIsolateTestSequences(firstIsolateNum + 2 * numIsolatesPerSelAgarPlate, numIsolatesPerSelAgarPlate),
      bs48h: makeEmptyIsolateTestSequences(firstIsolateNum + 3 * numIsolatesPerSelAgarPlate, numIsolatesPerSelAgarPlate),
   };
}

export function makeEmptyIsolateIdentification(): IsolateIdentification
{
   return {
      method: null,
      identCode: null,
      identText: null,
      attachmentLabel: null,
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
      numIsolates: number
   )
   : IsolateTestSequencesByUid
{
   const seqs: IsolateTestSequencesByUid = {};

   for (let i = 1; i <= numIsolates; ++i)
   {
      const uid = makeIsolateTestSequenceUid(i);
      seqs[uid] = makeEmptyIsolateTestSequence(i);
   }

   return seqs;
}

export function makeIsolateTestSequenceUid
   (
      isolateNum: number,
      uniquenessTestObj: { [key: string]: any } = null
   )
   : string
{
   const uidBase = isolateNum.toString();
   let uid = uidBase;

   let seqNum = 1;
   if ( uniquenessTestObj )
   {
      while (uniquenessTestObj[uid] != null)
         uid = uidBase + '-' + (++seqNum);
   }

   return uid;
}

export function makeEmptyIsolateTestSequence(isolateNum: number): IsolateTestSequence
{
   return {
      isolateNumber: isolateNum,
      colonyAppearance: null,
      tsiTubeTest: makeEmptySlantTubeTest(),
      liaTubeTest: makeEmptySlantTubeTest(),
      ureaDetection: null,
      oxidaseDetection: null,
      identification: null,
      failure: null,
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

export function vidasHoursElapsedFromSampleReceipt(testData: TestData): number | null
{
   const vidasTimestampStr = testData.vidasData.positiveControlDetectionEntered;
   const sampleReceivedDateEnteredStr = testData.prepData.sampleReceivedDateEntered;

   if ( vidasTimestampStr == null || sampleReceivedDateEnteredStr == null )
      return null;

   const vidas = moment(vidasTimestampStr);
   const sampleRec = moment(sampleReceivedDateEnteredStr);

   return vidas.diff(sampleRec, 'hours');
}

export function getTestMediumBatchIds(testData: TestData): string[]
{
   const batchIds = [
      testData.preEnrData.mediumBatchId,
      testData.selEnrData.rvBatchId,
      testData.selEnrData.ttBatchId,
      testData.selEnrData.bgBatchId,
      testData.selEnrData.i2kiBatchId,
      testData.mBrothData.mBrothBatchId,
   ];

   return (
      batchIds
      .filter(batchId => batchId != null && batchId.trim().length > 0)
      .map(batchId => batchId.trim())
   );
}

export function containsPositiveIdentification(contTests: ContinuationTests): boolean
{
   for (const selAgarsTestSuite of [contTests.rvSourcedTests, contTests.ttSourcedTests])
   {
      for (const selAgar of Object.keys(selAgarsTestSuite))
      {
         const isolateTestSeqs = selAgarsTestSuite[selAgar] as IsolateTestSequencesByUid;

         for (const isolateTestSeq of Object.values(isolateTestSeqs))
         {
            if ( !isolateTestSeq.failure &&
                 isolateTestSeq.identification != null &&
                 isolateTestSeq.identification.identCode != null )
               return true;
         }
      }
   }

   return false;
}
