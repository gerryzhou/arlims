import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip, of as obsof} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {AuditLogQueryService, TestsService, UserContextService} from '../shared/services';
import {LabGroupTestData} from '../shared/models/lab-group-test-data';

@Injectable({providedIn: 'root'})
export class LabGroupTestDataResolver implements Resolve<LabGroupTestData> {

   constructor
      (
         private testsService: TestsService,
         private usrCtxSvc: UserContextService,
         private auditLogSvc: AuditLogQueryService,
      )
   {}

   resolve
      (
         route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot
      )
      : Observable<LabGroupTestData>
   {
      const testId = +route.paramMap.get('testId');
      if (isNaN(testId)) { return throwError('Invalid test id'); }

      const sampleInTest$ = this.usrCtxSvc.getSampleInTest(testId);
      const testConfig$ = sampleInTest$.pipe(
         flatMap(sampleInTest =>
            this.usrCtxSvc.getLabGroupTestConfigJson(sampleInTest.testMetadata.testTypeCode).pipe(
               map(configJson => configJson ? JSON.parse(configJson) : null)
            )
         )
      );

      return (
         zip(
            testConfig$,
            this.testsService.getVersionedTestData(testId),
            this.testsService.getTestAttachedFilesMetadatas(testId),
            sampleInTest$,
            this.usrCtxSvc.getLabResourcesByType(),
            !!route.data['includeAuditLogEntries'] ? this.auditLogSvc.getEntriesForTest(testId) : obsof(null),
            this.usrCtxSvc.getAuthenticatedUser(),
         )
         .pipe(
            map(([labGroupTestConfig, versionedTestData, attachedFiles, sampleInTest, labResourcesByType, auditLogEntries, appUser]) =>
                ({labGroupTestConfig, versionedTestData, attachedFiles, sampleInTest, labResourcesByType, auditLogEntries, appUser})
            )
         )
      );
   }
}
