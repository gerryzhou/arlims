import {SampleOpStatusCode} from '../../shared/client-models/sample-op-status';

export interface ListingOptions {

   searchText?: string;

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   includeStatuses: SampleOpStatusCode[];

}

