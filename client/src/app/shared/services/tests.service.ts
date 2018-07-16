import { Injectable } from '@angular/core';
import {ApiUrlsService} from './api-urls.service';
import {Observable} from 'rxjs';
import {DataUpdateStatus, VersionedTestData} from '../../../generated/dto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestsService {

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) { }

   getVersionedTestData(testId: number): Observable<VersionedTestData> {
      return this.httpClient.get<VersionedTestData>(
         this.apiUrlsSvc.versionedTestDataUrl(testId)
      );
   }

   saveTestData(testId: number, testData: any, prevMd5: string): Observable<DataUpdateStatus> {
      const formData: FormData = new FormData();

      formData.append('testDataJson',
         new Blob(
            [JSON.stringify(testData)],
            { type: 'application/json' }
         )
      );

      formData.append('previousMd5', prevMd5);

      return this.httpClient.post<DataUpdateStatus>(
         this.apiUrlsSvc.versionedTestDataUrl(testId),
         formData
      );
   }
}
