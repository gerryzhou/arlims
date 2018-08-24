import { Injectable } from '@angular/core';
import {
   HttpRequest,
   HttpHandler,
   HttpEvent,
   HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';

import {UserContextService} from './user-context.service';
import {ApiUrlsService} from './api-urls.service';

@Injectable()
export class AuthTokenHttpInterceptor implements HttpInterceptor {

   constructor
      (
         private userCtxSvc: UserContextService,
         private apiUrlsSvc: ApiUrlsService
      )
   {}

   intercept(origReq: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
   {
      if ( this.apiUrlsSvc.isAppApiUrl(origReq.url) )
      {
         const authTok = this.userCtxSvc.getAuthenticationToken().getValue();

         if (authTok !== null)
         {
            return next.handle(
               origReq.clone({
                  setHeaders: {Authorization: `Bearer ${authTok}`}
               })
            );
         }
      }

      return next.handle(origReq);
   }
}
