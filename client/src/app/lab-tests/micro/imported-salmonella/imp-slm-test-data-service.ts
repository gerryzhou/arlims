import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as obsof} from 'rxjs';
import {ApiUrlsService} from '../../../shared/services/api-urls.service';
import {ImpSlmTestData} from './imp-slm-test-data';
import {TestStageStatus} from '../../test-stage-status';

@Injectable()
export class ImpSlmTestDataService {

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) {}

   // TODO

   saveTestData(testId: number, testData: ImpSlmTestData): Observable<void> {
      // TODO
      return null;
   }

   assignTestData(toTestData: ImpSlmTestData, fromTestData: ImpSlmTestData): ImpSlmTestDataMergeResult {
      // TODO
      return null;
   }

   getStageStatuses(testData: ImpSlmTestData): TestStageStatus[] {
      // TODO
      return [];
   }
}

interface ImpSlmTestDataMergeResult {
   overwrittenFieldValuesCount: number;
}
