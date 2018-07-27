import {LabTestType, Sample} from '../../../generated/dto';

export interface NewTestInfo {

   sample: Sample;
   availableTestTypes: LabTestType[];

   selectedTestType: LabTestType;
   beginDate: Date; // TODO: Use proper date (-only) type here.

}
