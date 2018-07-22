import { Injectable } from '@angular/core';
import {ApiUrlsService} from './api-urls.service';
import {Observable, of as observable} from 'rxjs';
import {DataModificationInfo, OptimisticDataUpdateResult, VersionedTestData} from '../../../generated/dto';
import {HttpClient} from '@angular/common/http';
import {flatMap, map} from 'rxjs/operators';
import {copyWithMergedValuesFrom, partitionLeftChangedAndNewValuesVsRefByConflictWithRights} from '../util/data-objects';
import {TestStageStatus} from "../../lab-tests/test-stages";


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

   saveTestData(testId: number, testData: any, prevTestData: any, prevTestDataMd5: string, stageStatusesFn: (any) => TestStageStatus[]): Observable<SaveResult> {
      const formData: FormData = new FormData();

      formData.append('testDataJson',
         new Blob(
            [JSON.stringify(testData)],
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

      const url = this.apiUrlsSvc.versionedTestDataUrl(testId);

      return this.httpClient.post<OptimisticDataUpdateResult>(url, formData).pipe( // optimistic update attempt
         flatMap(optUpdRes => {
            if (optUpdRes.succeeded) {
               return observable(new SaveResult(true, null));
            }

            // There was a concurrent modification of this data, attempt auto-merge.

            return this.mergeWithTestDataFromDatabase(testData, prevTestData, testId).pipe(
               flatMap(mergeRes => {
                  return mergeRes.hasConflicts ?
                     // If conflicts exist, just report the conflicts without any further attempt to save.
                     observable(new SaveResult(false, mergeRes))
                     // Latest db data merged cleanly onto local changes: attempt this process again with new db test data as baseline.
                     : this.saveTestData(testId, mergeRes.mergedTestData, mergeRes.dbTestData, mergeRes.dbModificationInfo.dataMd5, stageStatusesFn);
               })
            );
         })
      );
   }

   private mergeWithTestDataFromDatabase(testData: any, origTestData: any, testId): Observable<MergeResults> {
      return this.getVersionedTestData(testId).pipe(
         map(dbVerTestData => {
            const dbModInfo = dbVerTestData.modificationInfo;
            const dbTestData = dbVerTestData.testDataJson ? JSON.parse(dbVerTestData.testDataJson) : {};

            const conflictPartitionedDbValues =
               partitionLeftChangedAndNewValuesVsRefByConflictWithRights(dbTestData, testData, origTestData, true);

            const mergeableDbValues = conflictPartitionedDbValues.nonConflictingValues;
            const conflictingDbValues = conflictPartitionedDbValues.conflictingValues;

            const mergedTestData = copyWithMergedValuesFrom(testData, mergeableDbValues, false);

            return new MergeResults(mergedTestData, conflictingDbValues, dbTestData, dbModInfo);
         })
      );
   }
}

export class SaveResult {

   constructor(public saved: boolean, public mergeConflicts: MergeResults|null) {}

}

export class MergeResults {

   constructor(
      public mergedTestData: any,      // Test data with local changes plus non-conflicting db changes.
      public conflictingDbValues: any, // Lack of conflicts is represented by an empty object here.
      public dbTestData: any,
      public dbModificationInfo: DataModificationInfo,
   ) {}

   get hasConflicts(): boolean { return Object.keys(this.conflictingDbValues).length > 0; }
}

