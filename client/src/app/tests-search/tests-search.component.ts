import {Component} from '@angular/core';
import {BehaviorSubject, from as obsFrom, Observable} from 'rxjs';
import {catchError, map, take} from 'rxjs/operators';

import {Router} from '@angular/router';
import {AlertMessageService, TestsService, UserContextService} from '../shared/services';
import {AppInternalUrlsService} from '../shared/services/app-internal-urls.service';
import {LabTestType, SampleOp, SampleOpTest} from '../../generated/dto';
import {TestClickEvent, TestStageClickEvent} from '../common-components/test-metadata/events';
import {emptyTestsSearchQuery, TestsSearchQuery} from './query/tests-search-query';

@Component({
   selector: 'app-tests-search',
   templateUrl: './tests-search.component.html',
   styleUrls: ['./tests-search.component.scss']
})
export class TestsSearchComponent {

   readonly labTestTypes$: Observable<LabTestType[]>;

   readonly resultSampleOps = new BehaviorSubject<SampleOp[]>([]); // result tests organized under their samples

   readonly expandedSampleOpIds = new Set<number>();

   readonly defaultQuery: TestsSearchQuery;

   numTestsInResults: number | null;
   numSamplesInResults: number | null;

   constructor
      (
         private testsSvc: TestsService,
         private userCtxSvc: UserContextService,
         private appUrlsSvc: AppInternalUrlsService,
         private alertMsgSvc: AlertMessageService,
         private router: Router
      )
   {
      this.labTestTypes$ = obsFrom(userCtxSvc.getLabGroupContents().then(lgc => lgc.supportedTestTypes));
      this.defaultQuery = emptyTestsSearchQuery();
   }

   doQuery(query: TestsSearchQuery)
   {
      this.testsSvc.findTests(
         query.searchText,
         query.fromTimestamp,
         query.toTimestamp,
         query.timestampPropertyName,
         query.testTypeCode ? [query.testTypeCode] : null,
      )
      .pipe(
         catchError(err => {
            console.log(err);
            this.alertMsgSvc.alertDanger('Could not fetch results due to error.');
            return [];
         }),
         take(1),
      )
      .subscribe(results => this.onQueryResultsArrived(results));
   }

   private onQueryResultsArrived(results: SampleOpTest[])
   {
      this.numTestsInResults = results.length;

      const organizedSampleOps = organizeTestsBySample(results);

      this.numSamplesInResults = organizedSampleOps.length;

      this.resultSampleOps.next(organizedSampleOps);
   }

   toggleSampleExpanded(sampleOpId: number)
   {
      if ( this.expandedSampleOpIds.has(sampleOpId) )
      {
         this.expandedSampleOpIds.delete(sampleOpId);
      }
      else
      {
         this.expandedSampleOpIds.add(sampleOpId);
      }
   }

   onTestStageClicked(e: TestStageClickEvent)
   {
      this.router.navigate(this.appUrlsSvc.testStageDataView(e.testTypeCode, e.testId, e.stageName));
   }

   onTestClicked(e: TestClickEvent)
   {
      this.router.navigate(this.appUrlsSvc.testDataView(e.testTypeCode, e.testId));
   }

   onTestAttachedFilesClicked(e: TestClickEvent)
   {
      this.router.navigate(this.appUrlsSvc.testAttachedFilesView(e.testId));
   }

   onTestReportsClicked(e: TestClickEvent)
   {
      this.router.navigate(this.appUrlsSvc.testReportsListing(e.testTypeCode, e.testId));
   }
}

function organizeTestsBySample(sampleOpTests: SampleOpTest[]): SampleOp[]
{
   const samplesByOpId = new Map();

   for ( const sampleOpTest of sampleOpTests )
   {
      let sampleOp: SampleOp;

      if ( samplesByOpId.has(sampleOpTest.sampleOp.opId) )
         sampleOp = samplesByOpId.get(sampleOpTest.sampleOp.opId);
      else
      {
         sampleOp = sampleOpTest.sampleOp;
         samplesByOpId.set(sampleOp.opId, sampleOp);
      }
      if ( !sampleOp.tests )
         sampleOp.tests = [sampleOpTest.testMetadata];
      else
         sampleOp.tests.push(sampleOpTest.testMetadata);
   }

   return Array.from(samplesByOpId.values());
}


