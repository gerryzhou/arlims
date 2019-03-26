import {Injectable} from '@angular/core';
import {Observable, of as observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {flatMap, map} from 'rxjs/operators';
import {Moment} from 'moment';

import {copyWithMergedValuesFrom, partitionLeftChangedAndNewValuesVsRefByConflictWithRights} from '../util/data-objects';
import {ApiUrlsService} from './api-urls.service';
import {
   CreatedTestAttachedFiles,
   CreatedTestMetadata,
   DataModificationInfo,
   LabTestTypeCode,
   OptimisticDataUpdateResult, SampleOp,
   SampleOpTest,
   TestAttachedFileMetadata,
   VersionedTestData
} from '../../../generated/dto';
import {TestStageStatus} from '../../lab-tests/test-stages';

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
         .set('stn', sampleOp.sampleTrackingNum.toString())
         .set('stsn', sampleOp.sampleTrackingSubNum.toString())
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
         stageStatusesFn: (any) => TestStageStatus[],
         jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter
      )
      : Observable<SaveResult>
   {
      const formData: FormData = new FormData();

      formData.append('testDataJson',
         new Blob(
            [JSON.stringify(testData, jsonFieldFormatter)],
            { type: 'application/json' }
         )
      );

      formData.append('stageStatusesJson',
         new Blob(
            [JSON.stringify(stageStatusesFn(testData))],
            { type: 'application/json' }
         )
      );

      formData.append('previousMd5', prevTestDataMd5);

      const url = this.apiUrlsSvc.testDataUrl(testId);

      return this.httpClient.post<OptimisticDataUpdateResult>(url, formData).pipe( // optimistic update attempt
         flatMap(optUpdRes => {

            if ( optUpdRes.savedMd5 )
               return observable(new SaveResult(optUpdRes.savedMd5, null));

            // There was a concurrent modification of this data, attempt auto-merge.

            return this.mergeWithTestDataFromDatabase(testData, prevTestData, testId, jsonFieldFormatter).pipe(
               flatMap(mergeRes => {
                  return mergeRes.hasConflicts ?
                     // If conflicts exist, just report the conflicts without any further attempt to save.
                     observable(new SaveResult(null, mergeRes)) :
                     // Latest db data merged cleanly onto local changes: attempt this process again with new db test data as baseline.
                     this.saveTestData(
                        testId,
                        mergeRes.mergedTestData,
                        mergeRes.dbTestData,
                        mergeRes.dbModificationInfo.dataMd5,
                        stageStatusesFn
                     );
               })
            );
         })
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

   private mergeWithTestDataFromDatabase
      (
         testData: any,
         origTestData: any,
         testId,
         jsonFieldFormatter: (key: string, value: any) => string
      )
      : Observable<MergeResults>
   {
      return this.getVersionedTestData(testId).pipe(
         map(dbVerTestData => {
            const dbModInfo = dbVerTestData.modificationInfo;
            const dbTestData = dbVerTestData.testDataJson ? JSON.parse(dbVerTestData.testDataJson) : {};

            // Use normalized form of the test data, as it would be deserialized from db after storage, for comparisons.
            const normdTestData = JSON.parse(JSON.stringify(testData, jsonFieldFormatter));

            const conflictPartitionedDbValues =
               partitionLeftChangedAndNewValuesVsRefByConflictWithRights(dbTestData, normdTestData, origTestData, true);

            const mergeableDbValues = conflictPartitionedDbValues.nonConflictingValues;
            const conflictingDbValues = conflictPartitionedDbValues.conflictingValues;

            const mergedTestData = copyWithMergedValuesFrom(normdTestData, mergeableDbValues, true);

            return new MergeResults(mergedTestData, conflictingDbValues, dbTestData, dbModInfo);
         })
      );
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
         this.apiUrlsSvc.testsSearchUrl(
            searchText,
            fromTimestamp,
            toTimestamp,
            timestampProperty,
            includeTestTypeCodes
         );

      return this.httpClient.get<SampleOpTest[]>(searchUrl);
   }

   getTestModifyingEmployeeIds(testId: number): Observable<number[]>
   {
      return this.httpClient.get<number[]>(
         this.apiUrlsSvc.testModifyingEmployeeIdsUrl(testId)
      );
   }
}

export class SaveResult {

   constructor
      (
         public savedMd5: string | null,
         public mergeConflicts: MergeResults | null
      )
   {}

}

export class MergeResults {

   constructor
       (
          public mergedTestData: any,      // Test data with local changes plus non-conflicting db changes.
          public conflictingDbValues: any, // Lack of conflicts is represented by an empty object here.
          public dbTestData: any,
          public dbModificationInfo: DataModificationInfo,
       )
   {}

   get hasConflicts(): boolean { return Object.keys(this.conflictingDbValues).length > 0; }
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

