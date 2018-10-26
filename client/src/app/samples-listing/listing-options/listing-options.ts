
export interface ListingOptions {

   searchText?: string;

   includeSamplesAssignedOnlyToOtherUsers: boolean;

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   includeStatuses: SampleOpStatusCode[];
}

export interface SampleOpStatus {
   code: SampleOpStatusCode;
   displayName: string;
}

export type SampleOpStatusCode = 'S' | 'I' | 'O' | 'P' | 'A' | 'C';


export const SAMPLE_OP_STATUSES: SampleOpStatus[] = [
   {code: 'S', displayName: 'Assigned'},
   {code: 'I', displayName: 'In Progress'},
   {code: 'O', displayName: 'Original Completed'},
   {code: 'P', displayName: 'Pending'},
   {code: 'A', displayName: 'Accepted'},
   {code: 'C', displayName: 'Complete'},
];

