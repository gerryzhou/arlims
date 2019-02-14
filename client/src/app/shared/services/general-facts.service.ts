import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ApiUrlsService} from './api-urls.service';
import {SampleTransfer} from '../../../generated/dto';

// FACTS data access service for functions that are not dependent on a particular type of test.
@Injectable({
  providedIn: 'root'
})
export class GeneralFactsService {

   constructor
   (
      private httpClient: HttpClient,
      private apiUrlsSvc: ApiUrlsService,
   )
   {}

   getSampleTransfers(sampleTrackingNum: number, toPersonId: number|null): Observable<SampleTransfer[]>
   {
      return this.httpClient.get<SampleTransfer[]>(
         this.apiUrlsSvc.factsSampleTransfersUrl(sampleTrackingNum, toPersonId)
      );
   }
}
