import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserContextService} from '../shared/services';
import {LabGroupContents} from '../../generated/dto';


@Injectable()
export class LabGroupContentsResolver implements Resolve<LabGroupContents> {

   constructor(private userContextService: UserContextService) {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LabGroupContents> {
      return this.userContextService.getLabGroupContents();
   }
}
