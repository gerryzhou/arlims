import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip} from 'rxjs';
import {TestsService, UserContextService} from '../shared/services';
import {TestAttachedFileMetadata} from '../../generated/dto';
import {SampleInTest} from '../shared/models/sample-in-test';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class TestAttachedFilesResolver implements Resolve<TestAttachedFiles> {

   constructor
      (
         private testsService: TestsService,
         private usrCtxSvc: UserContextService
      )
   {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TestAttachedFiles> {
      const testId = +route.paramMap.get('testId');
      if (isNaN(testId)) { return throwError('Invalid test id'); }

      const attachedFiles$ = this.testsService.getTestAttachedFileMetadatas(testId);
      const sampleInTest$ = this.usrCtxSvc.getSampleInTest(testId);

      return zip(attachedFiles$, sampleInTest$).pipe(
         map(([attachedFiles, sampleInTest]) => (
            { attachedFiles, sampleInTest }
         ))
      );
   }
}

export interface TestAttachedFiles {
   sampleInTest: SampleInTest;
   attachedFiles: TestAttachedFileMetadata[];
}
