
export interface TestStageStatus {
   stageName: string;
   fieldValuesStatus: FieldValuesStatusCode;
}

export type FieldValuesStatusCode =
     'e'  // empty
   | 'i'  // incomplete
   | 'c'  // required fields complete
;

export function stageNameToTestDataFieldName(stageName: string): string {
   return stageName.toLowerCase()
      .replace(/-(.)/g, (match, group1) => group1.toUpperCase()) + 'Data';
}

export function stageTestDataFieldNameToStageName(testDataFieldName: string): string {
   return testDataFieldName
      .replace(/Data$/g, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2').toUpperCase();
}

export function statusForRequiredFieldValues(fieldValues: any[]): FieldValuesStatusCode {
   let valueFound = false;
   let nonValueFound = false;

   for (const v of fieldValues) {
      if (v === undefined || v === null || v === '') {
         nonValueFound = true;
      } else {
         valueFound = true;
      }
   }

   if (!valueFound) {
      return 'e';
   } else if (!nonValueFound) {
      return 'c';
   } else {
      return 'i';
   }
}

