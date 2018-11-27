import {Component} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AlertMessageService, TestsService} from '../shared/services';
import {TestsSearchQuery} from './query/tests-search-query';
import {Sample, SampleInTest} from '../../generated/dto';

@Component({
   selector: 'app-tests-search',
   templateUrl: './tests-search.component.html',
   styleUrls: ['./tests-search.component.scss']
})
export class TestsSearchComponent {

   query: TestsSearchQuery;

   readonly resultSamples = new BehaviorSubject<Sample[]>([]); // result tests organized under their samples

   readonly expandedSampleIds = new Set<number>();

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
      .subscribe(results => this.resultSamples.next(results));
   }

   toggleSampleExpanded(sampleId: number)
   {
      if ( this.expandedSampleIds.has(sampleId) )
      {
         this.expandedSampleIds.delete(sampleId);
      }
      else
      {
         this.expandedSampleIds.add(sampleId);
      }
   }

}


function organizeTestsBySample(sampleInTests: SampleInTest[]): Sample[]
{
   const samplesById = new Map();

   for ( const sampleInTest of sampleInTests )
   {
      let sample: Sample;

      if ( samplesById.has(sampleInTest.sample.id) )
         sample = samplesById.get(sampleInTest.sample.id);
      else
      {
         sample = sampleInTest.sample;
         samplesById.set(sample.id, sample);
      }
      if ( !sample.tests )
         sample.tests = [sampleInTest.testMetadata];
      else
         sample.tests.push(sampleInTest.testMetadata);
   }

   console.log(sampleInTests, Array.from(samplesById.values()));

   return Array.from(samplesById.values());
}


