import {LabTestType, LabTestTypeCode, SampleOp} from '../../../generated/dto';
import {Moment} from 'moment';

export interface NewTestInfo {

   sampleOp: SampleOp;
   availableTestTypes: LabTestType[];

   selectedTestType: LabTestTypeCode;
   beginDate: Moment;
}
