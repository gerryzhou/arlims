
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

export type SampleOpStatusCode = 'P' | 'A' |'S' | 'I' | 'O' |  'C';


export const SAMPLE_OP_STATUSES: SampleOpStatus[] = [
   {code: 'P', displayName: 'Pending'},
   {code: 'A', displayName: 'Accepted'},
   {code: 'S', displayName: 'Assigned'},
   {code: 'I', displayName: 'In Progress'},
   {code: 'O', displayName: 'Original Completed'},
   {code: 'C', displayName: 'Complete'},
];

