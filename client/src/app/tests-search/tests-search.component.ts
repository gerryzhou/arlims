import {Component} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {catchError, take} from 'rxjs/operators';

import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
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

   numTestsInResults: number | null;
   numSamplesInResults: number | null;

   readonly labTestTypes$: Observable<LabTestType[]>;

   readonly resultSampleOps = new BehaviorSubject<SampleOp[]>([]); // result tests organized under their samples

   readonly expandedSampleOpIds = new Set<number>();

   readonly defaultQuery: TestsSearchQuery;

   // Contains the router path of this listing, to be navigated to after visiting other views from here.
   readonly exitRouterPath: any[];

   constructor
      (
         private testsSvc: TestsService,
         private userCtxSvc: UserContextService,
         private appUrlsSvc: AppInternalUrlsService,
         private alertMsgSvc: AlertMessageService,
         private router: Router,
         private route: ActivatedRoute
      )
   {
      this.labTestTypes$ = from(userCtxSvc.getLabGroupContents().then(lgc => lgc.supportedTestTypes));
      this.defaultQuery = emptyTestsSearchQuery();

      this.exitRouterPath = [route.snapshot.routeConfig.path];
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
      const navData = this.makeNavigationData({ sampleOpTest: e.sampleOpTest });

      const testTypeCode = e.sampleOpTest.testMetadata.testTypeCode;
      const testId = e.sampleOpTest.testMetadata.testId;

      this.router.navigate(
         this.appUrlsSvc.testStageDataView(testTypeCode, testId, e.stageName),
         navData
      );
   }

   onTestClicked(e: TestClickEvent)
   {
      const navData = this.makeNavigationData({ sampleOpTest: e.sampleOpTest });

      const testTypeCode = e.sampleOpTest.testMetadata.testTypeCode;
      const testId = e.sampleOpTest.testMetadata.testId;

      this.router.navigate(
         this.appUrlsSvc.testDataView(testTypeCode, testId),
         navData
      );
   }

   onTestAttachedFilesClicked(e: TestClickEvent)
   {
      const navData = this.makeNavigationData({ sampleOpTest: e.sampleOpTest });

      const testId = e.sampleOpTest.testMetadata.testId;

      this.router.navigate(
         this.appUrlsSvc.testAttachedFilesView(testId),
         navData
      );
   }

   onTestReportsClicked(e: TestClickEvent)
   {
      const navData = this.makeNavigationData({ sampleOpTest: e.sampleOpTest });

      const testTypeCode = e.sampleOpTest.testMetadata.testTypeCode;
      const testId = e.sampleOpTest.testMetadata.testId;

      this.router.navigate(
         this.appUrlsSvc.testReportsListing(testTypeCode, testId),
         navData
      );
   }

   private makeNavigationData(stateObj: any): NavigationExtras
   {
      const newState = Object.assign({ exitRouterPath: this.exitRouterPath }, stateObj);

      return { state: newState };
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


