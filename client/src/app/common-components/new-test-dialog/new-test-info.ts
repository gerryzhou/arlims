import {LabTestType, LabTestTypeCode, Sample} from '../../../generated/dto';
import {Moment} from 'moment';

export interface NewTestInfo {

   sample: Sample;
   availableTestTypes: LabTestType[];

   selectedTestType: LabTestTypeCode;
   beginDate: Moment;
}
