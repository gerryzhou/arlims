import {LabTestTypeCode} from '../../../generated/dto';

export interface TestStageClickEvent {
   testId: number;
   testTypeCode: LabTestTypeCode;
   stageName: string;
}


export interface TestClickEvent {
   testId: number;
   testTypeCode: LabTestTypeCode;
}

