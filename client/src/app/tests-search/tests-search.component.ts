import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AlertMessageService, TestsService} from '../shared/services';
import {TestsSearchQuery} from './query/tests-search-query';
import {SampleOp, SampleOpTest} from '../../generated/dto';

@Component({
   selector: 'app-tests-search',
   templateUrl: './tests-search.component.html',
   styleUrls: ['./tests-search.component.scss']
})
export class TestsSearchComponent {

   query: TestsSearchQuery;

   readonly resultSampleOps = new BehaviorSubject<SampleOp[]>([]); // result tests organized under their samples

   readonly expandedSampleOpIds = new Set<number>();

   readonly defaultQuery: TestsSearchQuery = {
      searchText: null,
      fromTimestamp: null,
      toTimestamp: null,
      timestampPropertyName: 'created',
      includeStatusCodes: ['P', 'A', 'S', 'I', 'O', 'C'],
      testTypeCode: null,
   };

   constructor
      (
         private testsSvc: TestsService,
         private alertMsgSvc: AlertMessageService,
      )
   {
      this.query = this.defaultQuery;
   }

   queryChanged(query: TestsSearchQuery)
   {
      this.query = query;
   }

   doQuery()
   {
      this.testsSvc.findTests(
         this.query.searchText,
         this.query.fromTimestamp,
         this.query.toTimestamp,
         this.query.timestampPropertyName,
         this.query.includeStatusCodes,
         this.query.testTypeCode ? [this.query.testTypeCode] : null,
      )
      .pipe(
         map(organizeTestsBySample),
         catchError(err => {
            console.log(err);
            this.alertMsgSvc.alertDanger('Could not fetch results due to error.');
            return [];
         })
      )
      .subscribe(results => this.resultSampleOps.next(results));
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


