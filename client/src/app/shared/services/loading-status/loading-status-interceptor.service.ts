import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

import {LoadingStatusService} from './loading-status.service';


@Injectable()
export class LoadingStatusInterceptor implements HttpInterceptor {

   constructor(private loadingStatusService: LoadingStatusService) {}

   intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.loadingStatusService.requestStarted(req);
      return next.handle(req).pipe(
         finalize(() => this.loadingStatusService.requestFinished(req))
      );
   }

}
