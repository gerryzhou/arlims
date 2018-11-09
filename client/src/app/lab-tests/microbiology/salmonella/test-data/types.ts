import {SamplingMethod} from '../../sampling-methods';

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
   pVulgarisIdentification: IsolateIdentification;
   pVulgarisSatisfactory: boolean | null;
   pAerugiOxidaseDetection?: boolean| null;
   pAerugiSatisfactory: boolean | null;
   medium: SelectiveAgarsTestSuite;
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
   oxidaseDetection?: boolean | null;
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
   positive: boolean | null;
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
      salmonellaGaminaraSatisfactory: null,
      salmonellaDiarizonae: makeEmptySelectiveAgarsTestSuite(1, 1, username),
      salmonellaDiarizonaeSatisfactory: null,
      pVulgarisIdentification: makeEmptyIsolateIdentification(),
      pVulgarisSatisfactory: null,
      pAerugiOxidaseDetection: null,
      pAerugiSatisfactory: null,
      medium: makeEmptySelectiveAgarsTestSuite(1, 1, username),
      mediumSatisfactory: null,
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

export function makeEmptyIsolateIdentification(): IsolateIdentification
{
   return {
      method: null,
      identCode: null,
      identText: null,
      positive: null,
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

export function makeIsolateTestSequenceUid
   (
      timestamp: Date,
      userName: string,
      startSeqNum: number,
      uniquenessTestObj: { [key: string]: any } = null
   )
   : string
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

export function makeEmptyIsolateTestSequence(isolateNum: number): IsolateTestSequence
{
   return {
      isolateNumber: isolateNum,
      colonyAppearance: null,
      tsiTubeTest: makeEmptySlantTubeTest(),
      liaTubeTest: makeEmptySlantTubeTest(),
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
