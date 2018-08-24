import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserContextService} from '../shared/services';
import {AppInternalUrlsService} from '../shared/services/app-internal-urls.service';

@Injectable()
export class AuthenticatedUserGuard implements CanActivate {

   constructor
      (
         private usrCtxSvc: UserContextService,
         private appUrlsSvc: AppInternalUrlsService,
         private router: Router,
      ) {}

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
   {
      if ( this.usrCtxSvc.getAuthenticatedUser().getValue() !== null )
         return true;

      this.router.navigate(this.appUrlsSvc.login());
   }

}
