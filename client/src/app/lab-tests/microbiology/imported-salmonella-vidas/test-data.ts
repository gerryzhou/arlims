import {Signature} from '../../../shared/models/signature';
import {SamplingMethod} from '../../../../generated/dto';
import {TestStageStatus} from '../../test-stages';

// TODO: Break this down into stages, make function to create a new test with a {}-valued field for each stage.
//       Maybe remove sampleNumber and productName fields.
export interface TestData {
    sampleNumber?: number;
    productName?: string;
    sampleReceived?: string;
    sampleReceivedFrom?: string;
    descriptionMatchesCR?: boolean;
    labelAttachmentType?: LabelAttachmentType;
    containerMatchesCR?: boolean;
    containerMatchesCRSignature?: Signature;
    codeMatchesCR?: boolean;
    codeMatchesCRNotes?: string;
    codeMatchesCRSignature?: Signature;
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
    rvBatchId?: string;
    ttBatchId?: string;
    bgBatchId?: string;
    l2KiBatchId?: string;
    rvttWaterBathId?: string;
    rvttSignature?: Signature;
    mBrothBatchId?: string;
    mBrothWaterBathId?: string;
    mBrothSignature?: Signature;
    vidasInstrumentId?: string;
    vidasKitIds?: string[];
    vidasCompositesDetections?: boolean[];
    vidasPositiveControlDetection?: boolean;
    vidasMediumControlDetection?: boolean;
    vidasSpikeDetection?: boolean;
    vidasSignature?: Signature;
    systemControlsPositiveControlGrowth?: boolean;
    systemMediumPositiveControlGrowth?: boolean;
    systemControlsSignature?: Signature;
    collectorControlsPositveControlGrowth?: boolean;
    collectorControlsMediumControlGrowth?: boolean;
    collectorControlsSignature?: Signature;
    bacterialControlsUsed?: boolean;
    bacterialControlsSignature?: Signature;
    resultPositiveComponentsCount?: number;
    resultSignature?: Signature;
    reserveReserveSampleDisposition?: ReserveSampleDisposition;
    reserveSampleDestinations?: string[];
    reserveSampleNote?: string;
    allCompletedSignature?: Signature;
}

export type LabelAttachmentType = 'NONE' | 'ATTACHED_ORIGINAL' | 'ATTACHED_COPY' | 'SUBMITTED_ALONE';

export type ReserveSampleDisposition = 'NO_RESERVE_SAMPLE' | 'SAMPLE_DISCARDED_AFTER_ANALYSIS' | 'ISOLATES_SENT' | 'OTHER';

export interface ImpSlmTestDataMergeResult {
   overwrittenFieldValuesCount: number;
}

export function emptyTestData(): TestData {
      return {}; // TODO: Include field for each stage with value {}.
}

export function assignTestData(toTestData: TestData, fromTestData: TestData): ImpSlmTestDataMergeResult {
   // TODO
   return null;
}

export function getStageStatuses(testData: TestData): TestStageStatus[] {
   // TODO
   return [];
}

