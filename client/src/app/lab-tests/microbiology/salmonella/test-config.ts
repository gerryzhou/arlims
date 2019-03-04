import {SamplingMethod} from '../sampling-methods';

export interface TestConfig {

   samplingMethodChoices: SamplingMethod[];

   positiveTestUnitControlsMinimumSelectiveAgars?: number | null;

   positiveTestUnitsMinimumIsolatesPerSelectiveAgar?: number | null;

   positivesContinuationTestingSerologyRequired?: boolean | null;

   aoacMethodCode?: string | null;

   spikeSpeciesText?: string | null;

   spikeKitRemarksText?: string | null;
}

