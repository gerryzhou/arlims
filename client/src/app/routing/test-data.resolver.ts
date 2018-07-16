import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TestsService} from '../shared/services';
import {VersionedTestData} from '../../generated/dto';


@Injectable({providedIn: 'root'})
export class TestDataResolver implements Resolve<VersionedTestData> {

   constructor(private testsService: TestsService) {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VersionedTestData> {
      const testId = +route.paramMap.get('testId');
      return this.testsService.getVersionedTestData(testId);
   }
}
