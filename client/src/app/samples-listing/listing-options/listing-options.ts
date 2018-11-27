import {SampleOpStatusCode} from '../../shared/models/sample-op-status';

export interface ListingOptions {

   searchText?: string;

   includeSamplesAssignedOnlyToOtherUsers: boolean;

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   includeStatuses: SampleOpStatusCode[];

}

