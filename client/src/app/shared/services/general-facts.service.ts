import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ApiUrlsService} from './api-urls.service';
import {FactsUserTimeCharge, SampleOpTimeCharges, SampleTransfer} from '../../../generated/dto';

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

   getSampleTransfers
      (
         sampleTrackingNumber: number,
         toPersonId: number|null
      )
      : Observable<SampleTransfer[]>
   {
      return this.httpClient.get<SampleTransfer[]>(
         this.apiUrlsSvc.factsSampleTransfersUrl(sampleTrackingNumber, toPersonId)
      );
   }

   submitTimeCharges
      (
         opId: number,
         timeCharges: FactsUserTimeCharge[]
      )
      : Observable<void>
   {
      const subm: SampleOpTimeCharges = {
         operationId: opId,
         labHoursList: timeCharges
      };

      return (
         this.httpClient.post<void>(
            this.apiUrlsSvc.factsTimeChargesUrl(),
            subm
         )
      );
   }

   setSampleOperationWorkStatus(sampleOpId: number, statusCode: string, factsPersonId: number): Observable<void>
   {
      const url = this.apiUrlsSvc.factsSampleOpWorkStatusUrl(sampleOpId, factsPersonId);
      return this.httpClient.post<void>(url, statusCode);
   }
}
