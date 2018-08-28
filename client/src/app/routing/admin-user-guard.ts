import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserContextService} from '../shared/services';
import {AppInternalUrlsService} from '../shared/services/app-internal-urls.service';

@Injectable()
export class AdminUserGuard implements CanActivate {

   constructor
      (
         private usrCtxSvc: UserContextService,
         private appUrlsSvc: AppInternalUrlsService,
         private router: Router,
      )
   {}

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
   {
      const appUser = this.usrCtxSvc.getAuthenticatedUser().getValue();
      if ( appUser && appUser.roles.includes('ADMIN') )
         return true;

      this.router.navigate(this.appUrlsSvc.home());
   }

}
