
export interface SamplingMethod {
   name?: string | null;
   description?: string | null;
   testUnitsType: TestUnitsType | null;
   testUnitsCount: number | null;
   extractedGramsPerSub: number | null;
   numberOfSubsPerComposite?: number | null; // composites only
   userModifiable?: boolean | null;
}

export interface SampleTestUnits {
   testUnitsCount: number | null;
   testUnitsType: TestUnitsType | null;
}

export type TestUnitsType = 'subsample' | 'composite';

