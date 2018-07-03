export interface TestStageStatus {
   stageName: string;
   fieldValuesStatus: FieldValuesStatusCode;
   signedEpochTimeMillis: number;
   signedByShortName: string;
}

export type FieldValuesStatusCode =
     'e'  // empty
   | 'i'  // incomplete
   | 'c'  // required fields complete
;
