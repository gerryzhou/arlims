import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip, of, from} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';

import {AuditLogQueryService, TestsService, UserContextService} from '../shared/services';
import {LabGroupTestData} from '../shared/client-models/lab-group-test-data';
import {LabGroupContentsScope, SampleOpTest} from '../../generated/dto';

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
      const scope = route.queryParams['lgc-scope'] as LabGroupContentsScope | null;

      if ( isNaN(testId) ) { return throwError('Invalid test id'); }
      if ( !scope ) return throwError('scope is required');

      const sampleOpTest$ =
         scope === 'LAB_HISTORY' ? this.testsService.getTestSampleOpTestMetadata(testId) :
            from(this.usrCtxSvc.getSampleOpTest(testId, scope))
            .pipe(map(sampleOpTest => {
               if ( !sampleOpTest )
                  throwError(`Sample operation not found in user context for test id ${testId}.`);
               return sampleOpTest;
            }));

      const testConfig$ = sampleOpTest$.pipe(
         flatMap(sampleOpTest =>
            from(this.usrCtxSvc.getLabGroupTestConfigJson(sampleOpTest.testMetadata.testTypeCode)).pipe(
               map(configJson => configJson ? JSON.parse(configJson) : null)
            )
         )
      );

      const includeAuditEntries = !!route.data['includeAuditLogEntries'];
      const auditEntries$ = includeAuditEntries ?
         this.auditLogSvc.getEntriesForTest(testId)
         : of(null);

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
                  labGroupContentsScope: scope,
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
