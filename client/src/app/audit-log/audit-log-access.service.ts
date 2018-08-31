import {ApiUrlsService} from '../shared/services';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuditEntry} from '../../generated/dto';
import {Injectable} from '@angular/core';

@Injectable()
export class AuditLogAccessService {

   constructor
      (
         private apiUrlsSvc: ApiUrlsService,
         private httpClient: HttpClient,
      )
   {}

   getEntries
      (
         dateOrDateRange: string[] | null,
         testId: number | null,
         username: string | null,
         includeChangeData: boolean,
         includeUnchangedSaves: boolean
      )
      : Observable<AuditEntry[]>
   {
      return this.httpClient.get<AuditEntry[]>(
         this.apiUrlsSvc.auditLogEntriesQueryUrl(dateOrDateRange, testId, username, includeChangeData, includeUnchangedSaves)
      );
   }
}
