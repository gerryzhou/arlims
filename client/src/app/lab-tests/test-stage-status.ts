export interface TestStageStatus {
   stageName: string;
   fieldValuesStatus: FieldValuesStatusCode;
   signedEpochTimeMillis: number;
   signedByShortName: string;
}

export type FieldValuesStatusCode =
     'e'  // empty
   | 'p'  // partial
   | 'rc' // required fields complete
   | 'c'  // fully complete
;
