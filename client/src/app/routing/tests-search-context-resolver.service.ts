import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {TestsService} from '../shared/services';
import {TestsSearchContext} from '../tests-search/tests-search-context';

@Injectable({providedIn: 'root'})
export class TestsSearchContextResolver implements Resolve<TestsSearchContext> {

   constructor
   (
      private testsService: TestsService,
   )
   {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TestsSearchContext> {
      return (
         this.testsService.getAvailableTestSearchCapabilities()
         .pipe(map(testTypeSearchScopes => (
            {
               testTypeSearchScopes
            }
         )))
      );
   }
}
