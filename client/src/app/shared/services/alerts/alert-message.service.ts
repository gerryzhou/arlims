import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {AlertMessage} from './alert-message';


@Injectable({providedIn: 'root'})
export class AlertMessageService {

   private subject = new Subject<AlertMessage | null>();

   private persistThroughNavigation = false;

   constructor(private router: Router) {
      router.events.subscribe(event => {
         if ( event instanceof NavigationStart ) {
            if ( this.persistThroughNavigation ) {
               this.persistThroughNavigation = false;
            } else {
               // clear alert
               this.subject.next(null);
            }
         }
      });
   }

   messages(): Observable<AlertMessage | null> {
      return this.subject.asObservable();
   }

   alertSuccess(message: string, detailLines = null, persistThroughNavigation = false) {
      this.persistThroughNavigation = persistThroughNavigation;
      this.subject.next({ type: 'success', text: message, detailLines });
   }

   alertInfo(message: string, detailLines = null, persistThroughNavigation = false) {
      this.persistThroughNavigation = persistThroughNavigation;
      this.subject.next({ type: 'info', text: message, detailLines });
   }

   alertWarning(message: string, detailLines = null, persistThroughNavigation = false) {
      this.persistThroughNavigation = persistThroughNavigation;
      this.subject.next({ type: 'warning', text: message, detailLines });
   }

   alertDanger(message: string, detailLines = null, persistThroughNavigation = false) {
      this.persistThroughNavigation = persistThroughNavigation;
      this.subject.next({ type: 'danger', text: message, detailLines });
   }

}
