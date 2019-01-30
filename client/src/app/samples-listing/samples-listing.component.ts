import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import * as moment from 'moment';
import {Moment} from 'moment';

import {
   CreatedTestMetadata,
   LabGroupContents,
   LabTestMetadata,
   LabTestType,
   SampleOp
} from '../../generated/dto';
import {AlertMessageService, UserContextService} from '../shared/services';
import {ListingOptions} from './listing-options/listing-options';
import {SampleOpStatusCode} from '../shared/models/sample-op-status';
import {SelectedSampleOpsService} from '../shared/services/selected-sample-ops.service';

@Component({
   selector: 'app-samples-listing',
   templateUrl: './samples-listing.component.html',
   styleUrls: ['./samples-listing.component.scss'],
})
export class SamplesListingComponent {

   samples: SelectableSample[]; // all sample (-ops) in context, before any filtering or sorting

   // indexes of samples to be displayed in this.samples, having survived filters and optionally undergone sorting
   visibleSampleIxs: number[];

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   expandedSampleOpIds = new Set<number>();

   hiddenSelectedCount = 0;

   labGroupTestTypes: LabTestType[];

   contentsLastLoaded: Moment;

   readonly maxAutoExpandSamples = 3;

   @ViewChild('selectAllNoneCheckbox') selectAllNoneCheckbox;

   readonly defaultListingOptions: ListingOptions = {
      limitSelectionToVisibleSamples: true,
      showTestDeleteButtons: false,
      includeStatuses: ['P', 'A', 'S', 'I', 'O'],
   };

   constructor
       (
          private usrCtxSvc: UserContextService,
          private alertMsgSvc: AlertMessageService,
          private activatedRoute: ActivatedRoute,
          private selectedSampleOps: SelectedSampleOpsService,
       )
   {
      const selectedSampleOpIds = selectedSampleOps.takeSelectedSampleOps().map(so => so.opId);

      const labGroupContents = <LabGroupContents>this.activatedRoute.snapshot.data['labGroupContents'];
      this.refeshFromLabGroupContents(labGroupContents);

      // If there's no selection from the service and the number of samples visible is small enough then expand all.
      if ( this.visibleSampleIxs.length <= this.maxAutoExpandSamples && selectedSampleOpIds.length === 0 )
         this.expandedSampleOpIds = new Set(this.visibleSampleIxs.map(ix => this.samples[ix].sampleOp.opId));
      else
         this.expandedSampleOpIds = new Set(selectedSampleOpIds);
   }

   refeshFromLabGroupContents(labGroupContents: LabGroupContents)
   {
      this.labGroupTestTypes = labGroupContents.supportedTestTypes;
      this.samples = labGroupContents.activeSamples.map(s => new SelectableSample(s));
      this.applyFilters(this.defaultListingOptions);
      this.contentsLastLoaded = moment();
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
      for (let i = 0; i < this.samples.length; ++i)
      {
         const selectableSampleOp = this.samples[i];
         const passesFilters =
            this.sampleSatisfiesSearchTextRequirement(selectableSampleOp.sampleOp, listingOptions) &&
            this.sampleSatisfiesStatusCodeRequirement(selectableSampleOp.sampleOp, listingOptions);

         if ( passesFilters )
         {
            visibleIxs.push(i);
         }
         else
         {
            if (listingOptions.limitSelectionToVisibleSamples) { selectableSampleOp.selected = false; }
            else if (selectableSampleOp.selected) { this.hiddenSelectedCount++; }
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

   get selectedVisibleSamples(): SampleOp[]
   {
      const selectedSamples: SampleOp[] = [];
      for (const sampleOpIx of this.visibleSampleIxs)
      {
         const selectableSample = this.samples[sampleOpIx];
         if (selectableSample.selected)
         {
            selectedSamples.push(selectableSample.sampleOp);
         }
      }
      return selectedSamples;
   }

   get selectedSamples(): SampleOp[]
   {
      const selectedSamples: SampleOp[] = [];

      for (const selectableSample of this.samples)
      {
         if (selectableSample.selected)
         {
            selectedSamples.push(selectableSample.sampleOp);
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
         this.usrCtxSvc.refreshLabGroupContents().pipe(
            map(labGroupContents => this.refeshFromLabGroupContents(labGroupContents)),
            take(1)
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

