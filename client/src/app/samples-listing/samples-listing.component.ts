import {Component, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CreatedTestMetadata, LabGroupContents, LabTestMetadata, LabTestType, Sample} from '../../generated/dto';
import {AlertMessageService, UserContextService} from '../shared/services';
import {ListingOptions} from './listing-options/listing-options';
import {Subscription} from 'rxjs';

@Component({
   selector: 'app-samples-listing',
   templateUrl: './samples-listing.component.html',
   styleUrls: ['./samples-listing.component.scss'],
})
export class SamplesListingComponent implements OnDestroy {

   selectableSamples: SelectableSample[]; // all samples in context, before any filtering or sorting

   // samples to be displayed, having survived filters and optionally undergone sorting
   visibleSampleIxs: number[];

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   expandedSampleIds = new Set<number>();

   hiddenSelectedCount = 0;

   labGroupTestTypes: LabTestType[];

   labGroupContentsSubscription: Subscription;

   @ViewChild('selectAllNoneCheckbox') selectAllNoneCheckbox;

   readonly defaultListingOptions: ListingOptions = {
      includeSamplesAssignedOnlyToOtherUsers: false,
      limitSelectionToVisibleSamples: true,
      showTestDeleteButtons: false,
      includeStatuses: ['S', 'I', 'O', 'P', 'A'],
   };

   constructor
       (
          private usrCtxSvc: UserContextService,
          private activatedRoute: ActivatedRoute,
          private router: Router,
          private alertMessageSvc: AlertMessageService,
       )
   {
      const expandedSampleIdsStr = activatedRoute.snapshot.paramMap.get('expsmp');
      if (expandedSampleIdsStr)
      {
         for (const sampleIdStr of expandedSampleIdsStr.split(','))
         {
            const sampleId = +sampleIdStr;
            if (sampleId)
            {
               this.expandedSampleIds.add(sampleId);
            }
         }
      }

      const labGroupContents = <LabGroupContents>this.activatedRoute.snapshot.data['labGroupContents'];
      this.refeshFromLabGroupContents(labGroupContents);
   }

   refeshFromLabGroupContents(labGroupContents: LabGroupContents)
   {
      this.labGroupTestTypes = labGroupContents.supportedTestTypes;
      this.selectableSamples = labGroupContents.activeSamples.map(s => new SelectableSample(s));
      this.applyFilters(this.defaultListingOptions);
   }

   listingOptionsChanged(listingOptions: ListingOptions)
   {
      this.limitSelectionToVisibleSamples = listingOptions.limitSelectionToVisibleSamples;
      this.showTestDeleteButtons = listingOptions.showTestDeleteButtons;
      this.applyFilters(listingOptions);
   }

   applyFilters(listingOptions: ListingOptions)
   {
      this.hiddenSelectedCount = 0;
      const visibleIxs: number[] = [];
      for (let i = 0; i < this.selectableSamples.length; ++i)
      {
         const selectableSample = this.selectableSamples[i];
         // TODO: Add sample op status requirement here.
         const passesFilters =
            this.sampleSatisfiesSearchTextRequirement(selectableSample.sample, listingOptions) &&
            this.sampleSatisfiesUserAssignmentRequirement(selectableSample.sample, listingOptions);

         if ( passesFilters )
         {
            visibleIxs.push(i);
         }
         else
         {
            if (listingOptions.limitSelectionToVisibleSamples) { selectableSample.selected = false; }
            else if (selectableSample.selected) { this.hiddenSelectedCount++; }
         }
      }
      this.visibleSampleIxs = visibleIxs;
   }

   toggleSampleExpanded(sampleId: number)
   {
      if (this.expandedSampleIds.has(sampleId))
      {
         this.expandedSampleIds.delete(sampleId);
      }
      else
      {
         this.expandedSampleIds.add(sampleId);
      }
   }

   expandOrContractAllSamples()
   {
      if (this.expandedSampleIds.size > 0)
      {
         this.expandedSampleIds.clear();
      }
      else
      {
         this.visibleSampleIxs.forEach(sampleIx =>
            this.expandedSampleIds.add(this.selectableSamples[sampleIx].sample.id)
         );
      }
   }

   private sampleSatisfiesSearchTextRequirement(sample: Sample, listingOptions: ListingOptions): boolean
   {
      return !listingOptions.searchText || listingOptions.searchText.trim().length === 0 ||
         sample.productName.toLowerCase().includes(listingOptions.searchText.toLowerCase());
   }

   private sampleSatisfiesUserAssignmentRequirement(sample: Sample, listingOptions: ListingOptions): boolean
   {
      const userShortName = this.usrCtxSvc.getAuthenticatedUser().getValue().shortName;

      return listingOptions.includeSamplesAssignedOnlyToOtherUsers ||
         sample.assignments.findIndex(a => a.employeeShortName === userShortName) !== -1;
   }

   get selectedVisibleSamples(): Sample[]
   {
      const selectedSamples: Sample[] = [];
      for (const sampleIx of this.visibleSampleIxs)
      {
         const selectableSample = this.selectableSamples[sampleIx];
         if (selectableSample.selected)
         {
            selectedSamples.push(selectableSample.sample);
         }
      }
      return selectedSamples;
   }

   get selectedSamples(): Sample[]
   {
      const selectedSamples: Sample[] = [];
      for (const selectableSample of this.selectableSamples)
      {
         if (selectableSample.selected)
         {
            selectedSamples.push(selectableSample.sample);
         }
      }
      return selectedSamples;
   }

   selectOrUnselectVisible(select: boolean)
   {
      if (select)
      {
         this.selectAllVisible();
      }
      else
      {
         this.unselectAllVisible();
      }
   }

   selectAllVisible()
   {
      for (const sampleIx of this.visibleSampleIxs)
      {
         this.selectableSamples[sampleIx].selected = true;
      }
      // (hiddenSelectedCount is unchanged by this operation.)
   }

   unselectAllVisible()
   {
      for (const sampleIx of this.visibleSampleIxs)
      {
         this.selectableSamples[sampleIx].selected = false;
      }
      // (hiddenSelectedCount is unchanged by this operation.)
   }

   clearSelectAllCheckbox()
   {
      if (this.selectAllNoneCheckbox.checked)
      {
         this.selectAllNoneCheckbox.checked = false;
      }
   }

   countSelected(): number
   {
      let selectedCount = 0;
      for (const selectableSample of this.selectableSamples)
      {
         if (selectableSample.selected)
         {
            ++selectedCount;
         }
      }
      return selectedCount;
   }

   onNewTestCreated(createdTestMetadata: CreatedTestMetadata)
   {
      this.reload();
   }

   onTestCreationFailed(error: string)
   {
      this.alertMessageSvc.alertDanger('Failed to create new test: ' + error);
   }

   onTestDeleted(deletedTestMetadata: LabTestMetadata)
   {
      this.reload();
   }

   onTestDeleteFailed(error: string)
   {
      this.alertMessageSvc.alertDanger('Failed to delete test: ' + error);
   }

   private reload()
   {
      if (this.labGroupContentsSubscription)
         this.labGroupContentsSubscription.unsubscribe();

      this.labGroupContentsSubscription =
         this.usrCtxSvc.refreshLabGroupContents()
            .subscribe(labGroupContents => {
               this.refeshFromLabGroupContents(labGroupContents);
            });
   }

   ngOnDestroy(): void
   {
      if (this.labGroupContentsSubscription)
      {
         this.labGroupContentsSubscription.unsubscribe();
      }
   }

}

class SelectableSample {
   sample: Sample;
   selected: boolean;

   constructor(sample: Sample)
   {
      this.sample = sample;
      this.selected = false;
   }
}

