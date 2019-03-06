import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, from as obsFrom} from 'rxjs';
import * as moment from 'moment';
import {Moment} from 'moment';

import {arraysEqual} from '../shared/util/data-objects';
import {
   CreatedTestMetadata,
   LabGroupContents,
   LabTestMetadata,
   LabTestType,
   SampleOp
} from '../../generated/dto';
import {AlertMessageService, UserContextService} from '../shared/services';
import {LocalStorageService} from '../shared/services/local-storage.service';
import {SelectedSampleOpsService} from '../shared/services/selected-sample-ops.service';
import {ListingOptions} from './listing-options/listing-options';
import {SampleOpStatusCode} from '../shared/models/sample-op-status';

@Component({
   selector: 'app-samples-listing',
   templateUrl: './samples-listing.component.html',
   styleUrls: ['./samples-listing.component.scss'],
})
export class SamplesListingComponent {

   samples: SelectableSample[]; // all sample (-ops) in context, before any filtering or sorting

   labGroupTestTypes: LabTestType[];

   contentsLastLoaded: Moment;

   // indexes of samples to be displayed in this.samples, having survived filters and optionally undergone sorting
   visibleSampleIxs: number[];

   expandedSampleOpIds = new Set<number>();

   hiddenSelectedCount = 0;

   readonly DEFAULT_INCLUDE_STATUSES: SampleOpStatusCode[] = ['S', 'I'];
   readonly PREF_INCLUDE_STATUSES = 'include-statuses';

   @ViewChild('selectAllNoneCheckbox') selectAllNoneCheckbox;

   listingOptions: ListingOptions;

   constructor
       (
          private usrCtxSvc: UserContextService,
          private alertMsgSvc: AlertMessageService,
          private activatedRoute: ActivatedRoute,
          private selectedSampleOps: SelectedSampleOpsService,
          private localStorageSvc: LocalStorageService
       )
   {
      const selectedSampleOpIds = selectedSampleOps.takeSelectedSampleOps().map(so => so.opId);

      const labGroupContents = <LabGroupContents>this.activatedRoute.snapshot.data['labGroupContents'];

      const prefIncludeStatuses: SampleOpStatusCode[] | null =
         JSON.parse(localStorageSvc.get(this.PREF_INCLUDE_STATUSES));
      const includeStatuses = prefIncludeStatuses || this.DEFAULT_INCLUDE_STATUSES;

      this.listingOptions = {
         limitSelectionToVisibleSamples: true,
         showTestDeleteButtons: false,
         includeStatuses
      };

      this.expandedSampleOpIds = new Set(selectedSampleOpIds);
      this.visibleSampleIxs = [];

      this.refreshFromLabGroupContents(labGroupContents);
   }

   refreshFromLabGroupContents(labGroupContents: LabGroupContents)
   {
      this.labGroupTestTypes = labGroupContents.supportedTestTypes;
      this.samples = labGroupContents.activeSamples.map(s => new SelectableSample(s));
      this.contentsLastLoaded = moment();
      this.applyFilters();
   }

   listingOptionsChanged(listingOptions: ListingOptions)
   {
      // Save the include statuses to local storage whenever they are changed.
      const includeStatusesChanged = this.listingOptions == null ||
         !arraysEqual(listingOptions.includeStatuses, this.listingOptions.includeStatuses);

      if ( includeStatusesChanged && this.localStorageSvc.readWriteStorageAvailable )
         this.localStorageSvc.store(this.PREF_INCLUDE_STATUSES, JSON.stringify(listingOptions.includeStatuses));

      this.listingOptions = listingOptions;

      this.applyFilters();
   }

   applyFilters()
   {
      this.hiddenSelectedCount = 0;
      const visibleIxs: number[] = [];
      for (let i = 0; i < this.samples.length; ++i)
      {
         const selectableSampleOp = this.samples[i];
         const passesFilters =
            this.sampleSatisfiesSearchTextRequirement(selectableSampleOp.sampleOp, this.listingOptions) &&
            this.sampleSatisfiesStatusCodeRequirement(selectableSampleOp.sampleOp, this.listingOptions);

         if ( passesFilters )
         {
            visibleIxs.push(i);
         }
         else
         {
            if ( this.listingOptions.limitSelectionToVisibleSamples ) { selectableSampleOp.selected = false; }
            else if ( selectableSampleOp.selected ) { this.hiddenSelectedCount++; }
         }
      }
      this.visibleSampleIxs = visibleIxs;
   }

   toggleSampleExpanded(sampleOpId: number)
   {
      if (this.expandedSampleOpIds.has(sampleOpId))
      {
         this.expandedSampleOpIds.delete(sampleOpId);
      }
      else
      {
         this.expandedSampleOpIds.add(sampleOpId);
      }
   }

   expandOrContractAllSamples()
   {
      if (this.expandedSampleOpIds.size > 0)
      {
         this.expandedSampleOpIds.clear();
      }
      else
      {
         this.visibleSampleIxs.forEach(sampleOpIx =>
            this.expandedSampleOpIds.add(this.samples[sampleOpIx].sampleOp.opId)
         );
      }
   }

   private sampleSatisfiesSearchTextRequirement
      (
         sample: SampleOp,
         listingOptions: ListingOptions
      )
      : boolean
   {
      return !listingOptions.searchText || listingOptions.searchText.trim().length === 0 ||
         sample.productName.toLowerCase().includes(listingOptions.searchText.toLowerCase());
   }

   private sampleSatisfiesStatusCodeRequirement
      (
         sample: SampleOp,
         listingOptions: ListingOptions
      )
      : boolean
   {
      const sampleStatus = sample.factsStatus as SampleOpStatusCode;
      return listingOptions.includeStatuses.includes(sampleStatus);
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
      for ( const sampleIx of this.visibleSampleIxs )
      {
         this.samples[sampleIx].selected = true;
      }
      // (hiddenSelectedCount is unchanged by this operation.)
   }

   unselectAllVisible()
   {
      for ( const sampleIx of this.visibleSampleIxs )
      {
         this.samples[sampleIx].selected = false;
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
      for (const selectableSample of this.samples)
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
      this.alertMsgSvc.alertDanger('Failed to create new test: ' + error);
   }

   onTestDeleted(deletedTestMetadata: LabTestMetadata)
   {
      this.reload();
   }

   onTestDeleteFailed(error: string)
   {
      this.alertMsgSvc.alertDanger('Failed to delete test: ' + error);
   }

   reload(): Observable<void>
   {
      const reload$: Observable<void> =
         obsFrom(
            this.usrCtxSvc.refreshLabGroupContents()
            .then(lgc => this.refreshFromLabGroupContents(lgc))
         );

      reload$.subscribe(
         null,
         err => this.alertMsgSvc.alertDanger('Failed to load samples ' + (err.message ? ': ' + err.message + '.' : '.'))
      );

      return reload$;
   }
}

class SelectableSample {
   sampleOp: SampleOp;
   selected: boolean;

   constructor(sampleOp: SampleOp)
   {
      this.sampleOp = sampleOp;
      this.selected = false;
   }
}

