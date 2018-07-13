import {Signature} from './signature';

export interface TestStageStatus {
   stageName: string;
   fieldValuesStatus: FieldValuesStatusCode;
   signature?: Signature;
}

export type FieldValuesStatusCode =
     'e'  // empty
   | 'i'  // incomplete
   | 'c'  // required fields complete
;
