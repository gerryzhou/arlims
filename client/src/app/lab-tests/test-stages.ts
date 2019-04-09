
export interface TestStageStatus {
   stageName: string;
   stageStatus: TestStageStatusCode;
}

export type TestStageStatusCode =
     'e'  // empty
   | 'i'  // incomplete
   | 'c'  // required fields complete
   | 'n'  // stage not-applicable
;

export function stageNameToTestDataFieldName(stageName: string): string
{
   return stageName.toLowerCase()
      .replace(/-(.)/g, (match, group1) => group1.toUpperCase()) + 'Data';
}

export function stageTestDataFieldNameToStageName(testDataFieldName: string): string
{
   return testDataFieldName
      .replace(/Data$/g, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2').toUpperCase();
}

export function statusForRequiredFieldValues
   (
      fieldValues: any[],
      allowEmptyArrayAsValue = false,
   )
   : TestStageStatusCode
{
   let valueFound = false;
   let nonValueFound = false;

   for (const v of fieldValues)
   {
      if ( v === undefined || v === null || v === '' ) nonValueFound = true;
      else if ( Array.isArray(v) )
      {
            valueFound = arrayContainsValue(v);
            nonValueFound = (!allowEmptyArrayAsValue && v.length === 0) || arrayContainsNonValue(v);
      }
      else valueFound = true;
   }

   return !valueFound ? 'e' : !nonValueFound ? 'c' : 'i';
}

export function arrayContainsValue<T>(a: Array<T>): boolean
{
   return a.some((item) => item != null);
}

export function countValueOccurrences<T>(a: Array<T>, v: T): number
{
   let count = 0;
   for ( const av of a ) if ( av === v ) ++count;
   return count;
}

export function arrayContainsNonValue<T>(a: Array<T>): boolean
{
   return a.some((item) => item == null);
}
