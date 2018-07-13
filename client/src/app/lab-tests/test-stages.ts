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

export function stageNameToTestDataFieldName(stageName: string): string {
   return stageName.toLowerCase()
      .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}

export function stageTestDataFieldNameToStageName(testDataFieldName: string): string {
   return testDataFieldName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2').toUpperCase();
}
