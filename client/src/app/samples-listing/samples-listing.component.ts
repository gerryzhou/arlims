import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LabGroupContents, Sample} from '../../generated/dto';
import {UserContextService} from '../shared/services';
import {ListingOptions} from './listing-options/listing-options';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-samples-listing',
  templateUrl: './samples-listing.component.html',
  styleUrls: ['./samples-listing.component.scss']
})
export class SamplesListingComponent implements OnInit {

   private readonly userShortName: string;

   allSamples: SelectableSample[];

   // samples to be displayed, having survived filters and optionally undergone sorting
   visibleSampleIxs: number[];

   showSampleDetails: boolean;
   limitSelectionToVisibleSamples: boolean;

   hiddenSelectedCount = 0;

   @ViewChild('selectAllNoneCheckbox') selectAllNoneCheckbox;

   readonly defaultListingOptions: ListingOptions =
      {
         includeSamplesAssignedOnlyToOtherUsers: false,
         showSampleDetails: false,
         limitSelectionToVisibleSamples: true
      };

   constructor(
      userContextService: UserContextService,
      private activatedRoute: ActivatedRoute,
      private dialogSvc: MatDialog
   ) {
      this.userShortName = userContextService.authenticatedUser.shortName;
   }

   ngOnInit() {
      const labGroupContents = <LabGroupContents>this.activatedRoute.snapshot.data['labGroupContents'];
      this.allSamples = labGroupContents.activeSamples.map(s => new SelectableSample(s));
      this.applyFilters(this.defaultListingOptions);
   }

   listingOptionsChanged(listingOptions: ListingOptions) {
      this.showSampleDetails = listingOptions.showSampleDetails;
      this.limitSelectionToVisibleSamples = listingOptions.limitSelectionToVisibleSamples;
      this.applyFilters(listingOptions);
   }

   applyFilters(listingOptions: ListingOptions) {
      this.hiddenSelectedCount = 0;
      const visibleIxs: number[] = [];
      for (let i = 0; i < this.allSamples.length; ++i) {
         const selectableSample = this.allSamples[i];
         const passes =
            this.sampleSatisfiesSearchTextRequirement(selectableSample.sample, listingOptions) &&
            this.sampleSatisfiesUserAssignmentRequirement(selectableSample.sample, listingOptions);
         if ( passes ) {
            visibleIxs.push(i);
         } else {
            if (listingOptions.limitSelectionToVisibleSamples) {
               selectableSample.selected = false;
            } else {
               if (selectableSample.selected) { this.hiddenSelectedCount++; }
            }
         }
      }
      this.visibleSampleIxs = visibleIxs;
   }

   private sampleSatisfiesSearchTextRequirement(sample: Sample, listingOptions: ListingOptions): boolean {
      return !listingOptions.searchText || listingOptions.searchText.trim().length === 0 ||
         sample.productName.toLowerCase().includes(listingOptions.searchText.toLowerCase());
   }

   private sampleSatisfiesUserAssignmentRequirement(sample: Sample, listingOptions: ListingOptions): boolean {
      return listingOptions.includeSamplesAssignedOnlyToOtherUsers ||
         sample.assignments.findIndex(a => a.employeeShortName === this.userShortName) !== -1;
   }

   get selectedVisibleSamples(): Sample[] {
      const selectedSamples: Sample[] = [];
      for (const sampleIx of this.visibleSampleIxs) {
         const selectableSample = this.allSamples[sampleIx];
         if (selectableSample.selected) {
            selectedSamples.push(selectableSample.sample);
         }
      }
      return selectedSamples;
   }

   get selectedSamples(): Sample[] {
      const selectedSamples: Sample[] = [];
      for (const selectableSample of this.allSamples) {
         if (selectableSample.selected) {
            selectedSamples.push(selectableSample.sample);
         }
      }
      return selectedSamples;
   }

   selectOrUnselectVisible(select: boolean) {
      if (select) {
         this.selectAllVisible();
      } else {
         this.unselectAllVisible();
      }
   }

   selectAllVisible() {
      for (const sampleIx of this.visibleSampleIxs) {
         this.allSamples[sampleIx].selected = true;
      }
      // (hiddenSelectedCount is unchanged by this operation.)
   }
   unselectAllVisible() {
      for (const sampleIx of this.visibleSampleIxs) {
         this.allSamples[sampleIx].selected = false;
      }
      // (hiddenSelectedCount is unchanged by this operation.)
   }

   clearSelectAllCheckbox() {
      if (this.selectAllNoneCheckbox.checked) {
         this.selectAllNoneCheckbox.checked = false;
      }
   }

   countSelected(): number {
      let selectedCount = 0;
      for (const selectableSample of this.allSamples) {
         if (selectableSample.selected) {
            ++selectedCount;
         }
      }
      return selectedCount;
   }

}

class SelectableSample {
   sample: Sample;
   selected: boolean;

   constructor(sample: Sample) {
      this.sample = sample;
      this.selected = false;
   }
}

