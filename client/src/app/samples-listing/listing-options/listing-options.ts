import {SampleOpStatusCode} from '../../shared/models/sample-op-status';

export interface ListingOptions {

   searchText?: string;

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   includeStatuses: SampleOpStatusCode[];

}

