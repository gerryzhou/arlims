import {Component, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
   CreatedTestMetadata,
   LabGroupContents,
   LabTestMetadata,
   LabTestType,
   Sample,
   SampleOpFailure, SampleOpIdent,
   SampleOpsRefreshResults
} from '../../generated/dto';
import {AlertMessageService, UserContextService} from '../shared/services';
import {ListingOptions, SampleOpStatusCode} from './listing-options/listing-options';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {Moment} from 'moment';
import {LabGroupService} from '../shared/services/lab-group-service';
import {flatMap, map, take} from 'rxjs/operators';

@Component({
   selector: 'app-samples-listing',
   templateUrl: './samples-listing.component.html',
   styleUrls: ['./samples-listing.component.scss'],
})
export class SamplesListingComponent {

   selectableSamples: SelectableSample[]; // all samples in context, before any filtering or sorting

   // samples to be displayed, having survived filters and optionally undergone sorting
   visibleSampleIxs: number[];

   limitSelectionToVisibleSamples: boolean;

   showTestDeleteButtons: boolean;

   expandedSampleIds = new Set<number>();

   hiddenSelectedCount = 0;

   labGroupTestTypes: LabTestType[];

   contentsLastLoaded: Moment;

   @ViewChild('selectAllNoneCheckbox') selectAllNoneCheckbox;

   readonly defaultListingOptions: ListingOptions = {
      includeSamplesAssignedOnlyToOtherUsers: false,
      limitSelectionToVisibleSamples: true,
      showTestDeleteButtons: false,
      includeStatuses: ['P', 'A', 'S', 'I', 'O'],
   };

   constructor
       (
          private usrCtxSvc: UserContextService,
          private labGroupSvc: LabGroupService,
          private alertMsgSvc: AlertMessageService,
          private activatedRoute: ActivatedRoute,
          private router: Router,
       )
   {
      // TODO: This expanded samples state would be better transferred via service.
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
      for (let i = 0; i < this.selectableSamples.length; ++i)
      {
         const selectableSample = this.selectableSamples[i];
         const passesFilters =
            this.sampleSatisfiesSearchTextRequirement(selectableSample.sample, listingOptions) &&
            this.sampleSatisfiesUserAssignmentRequirement(selectableSample.sample, listingOptions) &&
            this.sampleSatisfiesStatusCodeRequirement(selectableSample.sample, listingOptions);

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

   private sampleSatisfiesStatusCodeRequirement(sample: Sample, listingOptions: ListingOptions): boolean
   {
      const sampleStatus = sample.factsStatus as SampleOpStatusCode;
      return listingOptions.includeStatuses.includes(sampleStatus);
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

   refreshFromFacts()
   {
      this.labGroupSvc.refreshSampleOpsInUserParentOrg()
      .pipe(
         flatMap(refreshRes => this.reload().pipe(
            map(() => this.presentFactsRefreshResults(refreshRes))
         )),
         take(1),
      )
      .subscribe(
         null,
         err => this.alertMsgSvc.alertDanger('Failed to refresh from FACTS: ' + (err.message ? ': ' + err.message + '.' : '.'))
      );
   }

   private presentFactsRefreshResults(res: SampleOpsRefreshResults)
   {
      const failed: SampleOpFailure[] =
         [].concat(
            res.creationResults.failedSampleOps,
            res.updateResults.failedSampleOps,
            res.unmatchedStatusUpdateResults.failedSampleOps
         );

      const successCount =
         res.creationResults.succeededSampleOps.length +
         res.updateResults.succeededSampleOps.length +
         res.unmatchedStatusUpdateResults.succeededSampleOps.length;

      if ( failed.length === 0 )
         this.alertMsgSvc.alertSuccess('Refresh from FACTS succeeded with ' + successCount + ' samples affected.');
      else
      {
         const detailLines = failed.map(failure => describeSampleOpIdent(failure.sampleOpIdent) + ': ' + failure.error);
         this.alertMsgSvc.alertWarning('Refresh from FACTS completed with some errors:', detailLines);
      }
   }
}

function describeSampleOpIdent(sampleOpIdent: SampleOpIdent): string
{
   return sampleOpIdent.sampleNum + '-' + sampleOpIdent.sampleSubNum + ' (op=' + sampleOpIdent.opId + ')';
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

