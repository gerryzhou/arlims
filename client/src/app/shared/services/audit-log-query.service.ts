import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AuditLogEntry} from '../../../generated/dto';
import {ApiUrlsService} from './api-urls.service';
import {Moment} from 'moment';

@Injectable({providedIn: 'root'})
export class AuditLogQueryService {

   constructor
      (
         private apiUrlsSvc: ApiUrlsService,
         private httpClient: HttpClient,
      )
   {}

   getEntriesForTest(testId: number)
   {
      return this.getEntries(null, null, testId, null, true, true);
   }

   getEntries
      (
         fromMoment: Moment | null,
         toMoment: Moment | null,
         testId: number | null,
         username: string | null,
         includeChangeDetailData: boolean,
         includeUnchangedSaves: boolean
      )
      : Observable<AuditLogEntry[]>
   {
      return this.httpClient.get<AuditLogEntry[]>(
         this.apiUrlsSvc.auditLogEntriesQueryUrl(
            fromMoment,
            toMoment,
            testId,
            username,
            includeChangeDetailData,
            includeUnchangedSaves
         )
      );
   }
}
