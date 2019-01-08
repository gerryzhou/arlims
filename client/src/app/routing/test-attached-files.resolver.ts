import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError, zip} from 'rxjs';
import {TestsService, UserContextService} from '../shared/services';
import {SampleOpTest, TestAttachedFileMetadata} from '../../generated/dto';
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

      const attachedFiles$ = this.testsService.getTestAttachedFilesMetadatas(testId);
      const sampleOpTest$ = this.usrCtxSvc.getSampleOpTest(testId);

      return zip(attachedFiles$, sampleOpTest$).pipe(
         map(([attachedFiles, sampleOpTest]) => (
            { attachedFiles, sampleOpTest }
         ))
      );
   }
}

export interface TestAttachedFiles {
   sampleOpTest: SampleOpTest;
   attachedFiles: TestAttachedFileMetadata[];
}
