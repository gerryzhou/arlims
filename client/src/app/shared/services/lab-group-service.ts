import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {ApiUrlsService} from './api-urls.service';
import {SampleOpsRefreshResults} from '../../../generated/dto';

@Injectable({
   providedIn: 'root'
})
export class LabGroupService
{
   constructor
   (
      private httpClient: HttpClient,
      private apiUrlsSvc: ApiUrlsService,
   ) {}

   refreshSampleOpsInUserParentOrg(): Observable<SampleOpsRefreshResults>
   {
      const url = this.apiUrlsSvc.refreshUserOrganziationSampleOpsUrl();
      return this.httpClient.post<SampleOpsRefreshResults>(url, null);
   }
}
