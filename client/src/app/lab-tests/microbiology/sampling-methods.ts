
export interface SamplingMethod {
   name?: string;
   description?: string;
   testUnitsType?: 'subsample' | 'composite' | null;
   testUnitsCount?: number | null;
   numberOfSubsPerComposite?: number; // composites only
   extractedGramsPerSub?: number;     // composites only
   userModifiable?: boolean;
}

export interface SampleTestUnits {
   testUnitsCount: number | null;
   testUnitsType: 'subsample' | 'composite' | null;
}


export function makeSampleTestUnits(numSubs: number|null, numComps: number|null): SampleTestUnits
{
   if ( numSubs != null && numComps != null && numSubs >= 0 && numComps >= 0 )
   {
      const testUnitsType = numComps === 0 ? 'subsample' : 'composite';
      const testUnitsCount = numComps === 0 ? numSubs : numComps;
      return { testUnitsCount, testUnitsType };
   }
   else return { testUnitsCount: null, testUnitsType: null };
}

