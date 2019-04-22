import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, from, throwError} from 'rxjs';
import {UserContextService} from '../shared/services';
import {LabGroupContents, LabGroupContentsScope} from '../../generated/dto';

@Injectable({providedIn: 'root'})
export class LabGroupContentsResolver implements Resolve<LabGroupContents> {

   constructor(private usrCtxSvc: UserContextService) {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<LabGroupContents>
   {
      const contentsScope =
         (route.data && route.data['contentsScope'] ||
          route.paramMap['lgc-scope'] ||
          route.queryParams['lgc-scope']) as LabGroupContentsScope | null;

      if ( !contentsScope )
         throwError('contents scope is required');

      switch ( contentsScope )
      {
         case 'ANALYST':
            return from(this.usrCtxSvc.getLabGroupContents());
         case 'LAB':
            return from(this.usrCtxSvc.fetchLabScopedLabGroupContents());
         case 'LAB_HISTORY':
            return throwError('LAB_HISTORY is not a valid lab contents scope for general lab contents loading');
      }
   }
}
