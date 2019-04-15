import {SamplingMethod} from '../sampling-methods';

export interface TestConfig {

   samplingMethodChoices: SamplingMethod[];

   aoacMethodCode: string | null;

   positiveTestUnitControlsMinimumSelectiveAgars?: number | null;

   positiveTestUnitsMinimumIsolatesPerSelectiveAgar?: number | null;

   positivesContinuationTestingSerologyRequired?: boolean | null;

   spikeSpeciesText?: string | null;

   spikeKitRemarksText?: string | null;
}

