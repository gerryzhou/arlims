import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable()
export class LoadingStatusService {

   loadingStatus = new Subject<boolean>();

   private activeRequests: HttpRequest<any>[] = [];

   requestStarted(req: HttpRequest<any>): void {
      this.activeRequests.push(req);
      this.notify();
   }

   requestFinished(req: HttpRequest<any>): void {
      const index = this.activeRequests.indexOf(req);
      if (index !== -1) {
         this.activeRequests.splice(index, 1);
      }
      this.notify();
   }

   private notify(): void {
      this.loadingStatus.next(this.activeRequests.length !== 0);
   }

}
