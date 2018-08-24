import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';

import {UserContextService} from './user-context.service';

@Injectable()
export class AuthTokenHttpInterceptor implements HttpInterceptor {

   constructor(public userCtxSvc: UserContextService) {}

   intercept(origReq: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
   {
      const authTok = this.userCtxSvc.getAuthenticationToken().getValue();

      if ( authTok !== null )
      {
         return next.handle(
            origReq.clone({
               setHeaders: {Authorization: `Bearer ${authTok}`}
            })
         );
      }
      else
         return next.handle(origReq);
   }
}
