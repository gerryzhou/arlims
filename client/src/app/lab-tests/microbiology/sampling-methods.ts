
export interface SamplingMethod {
   name?: string;
   description?: string;
   testUnitsType?: TestUnitsType | null;
   testUnitsCount?: number | null;
   numberOfSubsPerComposite?: number; // composites only
   extractedGramsPerSub?: number;     // composites only
   userModifiable?: boolean;
}

export interface SampleTestUnits {
   testUnitsCount: number | null;
   testUnitsType: TestUnitsType | null;
}

export type TestUnitsType = 'subsample' | 'composite';

