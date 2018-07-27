import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LabGroupContents, LabTestMetadata, Sample} from '../../generated/dto';
import {UserContextService} from '../shared/services';
import {ListingOptions} from './listing-options/listing-options';
import {MatDialog} from '@angular/material';
import {LabTestStageMetadata} from '../shared/models/lab-test-stage-metadata';

@Component({
  selector: 'app-samples-listing',
  templateUrl: './samples-listing.component.html',
  styleUrls: ['./samples-listing.component.scss']
})
export class SamplesListingComponent {

   private readonly userShortName: string;

   allSamples: SelectableSample[];

   // samples to be displayed, having survived filters and optionally undergone sorting
   visibleSampleIxs: number[];

   limitSelectionToVisibleSamples: boolean;

   expandedSampleIds = new Set<number>();

   hiddenSelectedCount = 0;

   @ViewChild('selectAllNoneCheckbox') selectAllNoneCheckbox;

   readonly defaultListingOptions: ListingOptions =
      {
         includeSamplesAssignedOnlyToOtherUsers: false,
         limitSelectionToVisibleSamples: true
      };

   constructor(
      userContextService: UserContextService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private dialogSvc: MatDialog
   ) {
      this.userShortName = userContextService.authenticatedUser.shortName;

      const expandedSampleIdsStr = activatedRoute.snapshot.paramMap.get('expsmp');
      if (expandedSampleIdsStr) {
         for (const sampleIdStr of expandedSampleIdsStr.split(',')) {
            const sampleId = +sampleIdStr;
            if (sampleId) { this.expandedSampleIds.add(sampleId); }
         }
      }

      const labGroupContents = <LabGroupContents>this.activatedRoute.snapshot.data['labGroupContents'];
      this.allSamples = labGroupContents.activeSamples.map(s => new SelectableSample(s));
      this.applyFilters(this.defaultListingOptions);
   }

   listingOptionsChanged(listingOptions: ListingOptions) {
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

   setSampleExpanded(sampleId: number, expand: boolean) {
      if (!expand) {
         this.expandedSampleIds.delete(sampleId);
      } else {
         this.expandedSampleIds.add(sampleId);
      }
   }

   expandOrContractAllSamples() {
      if (this.expandedSampleIds.size > 0) {
         this.expandedSampleIds.clear();
      } else {
         this.visibleSampleIxs.forEach(sampleIx =>
            this.expandedSampleIds.add(this.allSamples[sampleIx].sample.id)
         );
      }
   }

   navigateToTest(test: LabTestMetadata) {
      this.router.navigate(['test-data', test.testTypeCode, test.testId]);
   }

   navigateToTestStage(testStage: LabTestStageMetadata) {
      const test = testStage.labTestMetadata;
      this.router.navigate(['test-data', test.testTypeCode, test.testId, testStage.stageName]);
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

