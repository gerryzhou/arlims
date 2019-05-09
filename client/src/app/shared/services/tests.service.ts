import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Moment} from 'moment';

import {ApiUrlsService} from './api-urls.service';
import {
   CreatedTestAttachedFiles,
   CreatedTestMetadata,
   LabTestTypeCode,
   OptimisticDataUpdateResult, SampleOp,
   SampleOpTest,
   TestAttachedFileMetadata,
   VersionedTestData
} from '../../../generated/dto';
import {TestStageStatus} from '../../lab-tests/test-stages';
import {TestDataSaveResult} from '../client-models/test-data-save-result';

@Injectable({
  providedIn: 'root'
})
export class TestsService {

   constructor
      (
         private httpClient: HttpClient,
         private apiUrlsSvc: ApiUrlsService,
      )
   {}

   createTest
      (
         sampleOp: SampleOp,
         testTypeCode: LabTestTypeCode,
         testBeginDate: string
      )
      : Observable<CreatedTestMetadata>
   {
      const url = this.apiUrlsSvc.newTestUrl();

      const body =
         new HttpParams()
         .set('op', sampleOp.opId.toString())
         .set('tc', testTypeCode)
         .set('bd', testBeginDate)
         .set('stn', sampleOp.sampleTrackingNumber.toString())
         .set('stsn', sampleOp.sampleTrackingSubNumber.toString())
         .set('pac', sampleOp.pac)
         .set('pn', sampleOp.productName)
         .set('lid', sampleOp.lid)
         .set('paf', sampleOp.paf)
         .set('s', sampleOp.subject)
      ;

      return this.httpClient.post<CreatedTestMetadata>(url, body);
   }

   deleteTest(testId: number): Observable<void>
   {
      const url = this.apiUrlsSvc.testUrl(testId);
      return this.httpClient.delete<void>(url);
   }

   getVersionedTestData(testId: number): Observable<VersionedTestData>
   {
      return this.httpClient.get<VersionedTestData>(
         this.apiUrlsSvc.testDataUrl(testId)
      );
   }

   getTestAttachedFilesMetadatas(testId: number): Observable<TestAttachedFileMetadata[]>
   {
      return this.httpClient.get<TestAttachedFileMetadata[]>(
         this.apiUrlsSvc.testAttachedFilesMetadatasUrl(testId)
      );
   }

   attachFilesToTest
      (
         testId: number,
         files: File[],
         label: string | null,
         ordering: number | null,
         testDataPart: string | null
      )
      : Observable<CreatedTestAttachedFiles>
   {
      const formData: FormData = new FormData();

      if ( label ) formData.append('label', label);
      if ( ordering ) formData.append('ordering', ordering.toString());

      formData.append('testDataPart', testDataPart);

      files.forEach(file => formData.append('files', file, file.name));

      return this.httpClient.post<CreatedTestAttachedFiles>(this.apiUrlsSvc.newTestAttachedFilesUrl(testId), formData);
   }

   updateTestAttachedFileMetadata
      (
         attachedFileId: number,
         testId: number,
         label: string | null,
         ordering: number | null,
         testDataPart: string | null,
         name: string
      )
   {
      let body =
         new HttpParams()
         .set('name', name)
         .set('testDataPart', testDataPart)
         .set('ordering', (ordering || 0).toString());

      if ( label ) body = body.set('label', label);

      return this.httpClient.post(this.apiUrlsSvc.testAttachedFileMetadataUrl(attachedFileId, testId), body);
   }

   deleteTestAttachedFile(attachedFileId: number, testId: number)
   {
      return this.httpClient.delete(this.apiUrlsSvc.testAttachedFileUrl(attachedFileId, testId));
   }

   saveTestData
      (
         testId: number,
         testData: any,
         prevTestData: any,
         prevTestDataMd5: string,
         stageStatuses: TestStageStatus[],
         jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter
      )
      : Observable<TestDataSaveResult>
   {
      const formData: FormData = new FormData();

      formData.append('testDataJson',
         new Blob([JSON.stringify(testData, jsonFieldFormatter)], { type: 'application/json' })
      );

      formData.append('stageStatusesJson',
         new Blob([JSON.stringify(stageStatuses)], { type: 'application/json' })
      );

      formData.append('previousMd5', prevTestDataMd5);

      const url = this.apiUrlsSvc.testDataUrl(testId);

      return (
         this.httpClient.post<OptimisticDataUpdateResult>(url, formData)
            .pipe(
               map(optUpdRes => ({
                  savedTestData: optUpdRes.savedMd5 ? testData : null,
                  optimisticDataUpdateResult: optUpdRes
               }))
            )
      );
   }

   // Write database data directly to the database without update conflicts management, as when restoring from backup.
   restoreTestData
      (
         saveDataFiles: File[]
      )
      : Observable<void>
   {
      const formData: FormData = new FormData();

      saveDataFiles.forEach(file => formData.append('saveDataFiles', file, file.name));

      const url = this.apiUrlsSvc.restoreTestSaveDatasUrl();

      return this.httpClient.post(url, formData).pipe(map(() => {}));
   }

   getTestReportBlobForPostedTestData
      (
         testId: number,
         reportName: string,
         testData: any
      )
      : Observable<Blob>
   {
      const reportUrl = this.apiUrlsSvc.reportUrl(testId, reportName);

      return this.httpClient.post(reportUrl, testData, {responseType: 'blob'});
   }

   findTests
      (
         searchText: string | null,
         fromTimestamp: Moment | null,
         toTimestamp: Moment | null,
         timestampProperty: string | null,
         includeTestTypeCodes: LabTestTypeCode[] | null
      )
      : Observable<SampleOpTest[]>
   {
      const searchUrl =
         this.apiUrlsSvc.fullTextTestSearchUrl(
            searchText,
            fromTimestamp,
            toTimestamp,
            timestampProperty,
            includeTestTypeCodes
         );

      return this.httpClient.get<SampleOpTest[]>(searchUrl);
   }

   getTestSampleOpTestMetadata(testId: number): Observable<SampleOpTest>
   {
      return this.httpClient.get<SampleOpTest>(
         this.apiUrlsSvc.testSampleOpTestMetadataUrl(testId)
      );
   }
}

export function defaultJsonFieldFormatter(key: string, value: any): any
{
   if (key.endsWith('Date') && value != null)
   {
      if (typeof value === 'object') return stringifyDate(<Date>value);
      else if (typeof value === 'string') return timestampStringToDateString(value);
      else throw new Error('Unrecognized date type: ' + (typeof value));
   }
   return value;
}

function stringifyDate(date: Date): string
{
   return date.toISOString().split('T')[0];
}

function timestampStringToDateString(value: string)
{
   return value.split('T')[0];
}

