import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LabGroupContents, Sample} from '../../generated/dto';
import {UserContextService} from '../shared/services';
import {ListingOptions} from './listing-options/listing-options';

@Component({
  selector: 'app-samples-listing',
  templateUrl: './samples-listing.component.html',
  styleUrls: ['./samples-listing.component.scss']
})
export class SamplesListingComponent implements OnInit {

   private readonly userShortName: string;

   unfilteredSamples: Sample[];

   filteredSamples: Sample[];

   readonly defaultListingOptions: ListingOptions = {
      includeSamplesAssignedOnlyToOtherUsers: false
   };

   constructor(userContextService: UserContextService, private activatedRoute: ActivatedRoute) {
      this.userShortName = userContextService.authenticatedUser.shortName;
   }

   ngOnInit() {
      const labGroupContents = <LabGroupContents>this.activatedRoute.snapshot.data['labGroupContents'];
      this.unfilteredSamples = labGroupContents.activeSamples;
      this.applyFilters(this.defaultListingOptions);
   }

   listingOptionsChanged(listingOptions: ListingOptions) {
      this.applyFilters(listingOptions);
   }

   applyFilters(listingOptions: ListingOptions) {
      this.filteredSamples = this.unfilteredSamples.filter(sample => (
        this.sampleSatisfiesSearchTextRequirement(sample, listingOptions) &&
        this.sampleSatisfiesUserAssignmentRequirement(sample, listingOptions)
      ));
   }

   private sampleSatisfiesSearchTextRequirement(sample: Sample, listingOptions: ListingOptions): boolean {
      return !listingOptions.searchText || listingOptions.searchText.trim().length === 0 ||
         sample.productName.toLowerCase().includes(listingOptions.searchText.toLowerCase());
   }

   private sampleSatisfiesUserAssignmentRequirement(sample: Sample, listingOptions: ListingOptions): boolean {
      return listingOptions.includeSamplesAssignedOnlyToOtherUsers ||
         sample.assignments.findIndex(a => a.employeeShortName === this.userShortName) !== -1;
   }

}
