import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip, of as obsOf, from as obsFrom} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {AuditLogQueryService, TestsService, UserContextService} from '../shared/services';
import {LabGroupTestData} from '../shared/client-models/lab-group-test-data';

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

      const sampleOpTest$ = obsFrom(this.usrCtxSvc.getSampleOpTest(testId));

      const testConfig$ = sampleOpTest$.pipe(
         flatMap(sampleOpTest =>
            obsFrom(this.usrCtxSvc.getLabGroupTestConfigJson(sampleOpTest.testMetadata.testTypeCode)).pipe(
               map(configJson => configJson ? JSON.parse(configJson) : null)
            )
         )
      );

      const includeAuditEntries = !!route.data['includeAuditLogEntries'];
      const auditEntries$ = includeAuditEntries ?
         this.auditLogSvc.getEntriesForTest(testId)
         : obsOf(null);

      return (
         zip(
            testConfig$,
            this.testsService.getVersionedTestData(testId),
            this.testsService.getTestAttachedFilesMetadatas(testId),
            sampleOpTest$,
            this.usrCtxSvc.getLabResourcesByType(),
            this.usrCtxSvc.getLabUsers(),
            auditEntries$,
            this.usrCtxSvc.getAuthenticatedUser(),
         )
         .pipe(
            map(([conf, data, files, test, res, users, audit, user]) =>
               ({
                  labGroupTestConfig: conf,
                  versionedTestData: data,
                  attachedFiles: files,
                  sampleOpTest: test,
                  labResourcesByType: res,
                  labGroupUsers: users,
                  auditLogEntries: audit,
                  appUser: user
               })
            )
         )
      );
   }
}
