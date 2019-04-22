import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {from, Observable, throwError, zip} from 'rxjs';
import {map} from 'rxjs/operators';

import {TestsService, UserContextService} from '../shared/services';
import {LabGroupContentsScope, SampleOpTest, TestAttachedFileMetadata} from '../../generated/dto';

@Injectable({providedIn: 'root'})
export class TestAttachedFilesResolver implements Resolve<TestAttachedFiles> {

   constructor
      (
         private usrCtxSvc: UserContextService,
         private testsService: TestsService,
      )
   {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TestAttachedFiles> {
      const testId = +route.paramMap.get('testId');
      const lgcScope = route.queryParams['lgc-scope'] as LabGroupContentsScope | null;

      if (isNaN(testId)) { return throwError('Invalid test id'); }
      if ( !lgcScope ) return throwError('scope is required');

      const attachedFiles$ = this.testsService.getTestAttachedFilesMetadatas(testId);

      const sampleOpTest$ = from(this.usrCtxSvc.getSampleOpTest(testId, lgcScope));

      return (
         zip(attachedFiles$, sampleOpTest$)
         .pipe(
            map(([attachedFiles, sampleOpTest]) => ({ attachedFiles, sampleOpTest }) )
         )
      );
   }
}

export interface TestAttachedFiles {
   sampleOpTest: SampleOpTest;
   attachedFiles: TestAttachedFileMetadata[];
}
