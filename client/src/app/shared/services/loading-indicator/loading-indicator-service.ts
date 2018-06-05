import { EventEmitter, Injectable } from '@angular/core'
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class LoadingIndicatorService {

   onLoadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

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
      this.onLoadingChanged.emit(this.activeRequests.length !== 0);
   }

}
