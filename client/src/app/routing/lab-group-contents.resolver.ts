import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, from as obsFrom} from 'rxjs';
import {UserContextService} from '../shared/services';
import {LabGroupContents} from '../../generated/dto';


@Injectable({providedIn: 'root'})
export class LabGroupContentsResolver implements Resolve<LabGroupContents> {

   constructor(private userContextService: UserContextService) {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LabGroupContents>
   {
      return obsFrom(this.userContextService.refreshLabGroupContents());
   }
}
