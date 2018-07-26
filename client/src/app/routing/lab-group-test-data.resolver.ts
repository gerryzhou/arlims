import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {TestsService, UserContextService} from '../shared/services';
import {LabGroupTestData} from '../shared/models/lab-group-test-data';


@Injectable({providedIn: 'root'})
export class LabGroupTestDataResolver implements Resolve<LabGroupTestData> {

   constructor(private testsService: TestsService, private usrCtxSvc: UserContextService) {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LabGroupTestData> {
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

      return zip(verTestData$, sampleInTest$, testConfig$, labResourcesByType$).pipe(
         map(([versionedTestData, sampleInTest, labGroupTestConfig, labResourcesByType]) => (
            { versionedTestData, sampleInTest, labGroupTestConfig, labResourcesByType }
         ))
      );
   }
}
