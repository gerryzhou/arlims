import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip, of as obsof} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {AuditLogQueryService, TestsService, UserContextService} from '../shared/services';
import {LabGroupTestData} from '../shared/models/lab-group-test-data';
import {AuditLogEntry} from '../../generated/dto';


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

      const verTestData$ = this.testsService.getVersionedTestData(testId);
      const sampleInTest$ = this.usrCtxSvc.getSampleInTest(testId);
      const testConfig$ = sampleInTest$.pipe(
         flatMap(sampleInTest =>
            this.usrCtxSvc.getLabGroupTestConfigJson(sampleInTest.testMetadata.testTypeCode).pipe(
               map(configJson => configJson ? JSON.parse(configJson) : null)
            )
         )
      );
      const labResourcesByType$ = this.usrCtxSvc.getLabResourcesByType();

      const auditLogEntries$: Observable<AuditLogEntry[] | null> =
         !!route.data['includeAuditLogEntries'] ? this.auditLogSvc.getEntriesForTest(testId) : obsof(null);

      return (
         zip(
            verTestData$,
            sampleInTest$,
            testConfig$,
            labResourcesByType$,
            auditLogEntries$,
         )
         .pipe(
            map(([versionedTestData, sampleInTest, labGroupTestConfig, labResourcesByType, auditLogEntries]) =>
               ({ versionedTestData, sampleInTest, labGroupTestConfig, labResourcesByType, auditLogEntries })
            )
         )
      );
   }
}
