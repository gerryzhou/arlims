import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';

import {TestsService} from '../shared/services';
import {SampleOpTest, TestAttachedFileMetadata} from '../../generated/dto';
import {getNavigationStateItem} from './routing-utils';


@Injectable({providedIn: 'root'})
export class TestAttachedFilesResolver implements Resolve<TestAttachedFiles> {

   constructor
      (
         private testsService: TestsService,
         private router: Router
      )
   {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TestAttachedFiles> {
      const testId = +route.paramMap.get('testId');
      if (isNaN(testId)) { return throwError('Invalid test id'); }

      const attachedFiles$ = this.testsService.getTestAttachedFilesMetadatas(testId);

      const sampleOpTest = getNavigationStateItem(this.router, 'sampleOpTest') as SampleOpTest;

      return attachedFiles$.pipe(
         map(attachedFiles => ({ attachedFiles, sampleOpTest }))
      );
   }
}

export interface TestAttachedFiles {
   sampleOpTest: SampleOpTest;
   attachedFiles: TestAttachedFileMetadata[];
}
