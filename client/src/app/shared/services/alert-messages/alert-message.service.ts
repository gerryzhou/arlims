import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {AlertMessage} from "./alert-message";


@Injectable({providedIn: 'root'})
export class AlertMessageService {

   private subject = new Subject<AlertMessage>()
   private persistThroughNavigation = false;

   constructor(private router: Router) {
      router.events.subscribe(event => {
         if ( event instanceof NavigationStart ) {
            if ( this.persistThroughNavigation ) {
               this.persistThroughNavigation = false;
            } else {
               // clear alert
               this.subject.next();
            }
         }
      });
   }

   messages(): Observable<AlertMessage> {
      return this.subject.asObservable();
   }

   alertSuccess(message: string, persistThroughNavigation = false) {
      this.persistThroughNavigation = persistThroughNavigation;
      this.subject.next({ type: 'success', text: message });
   }

   alertError(message: string, persistThroughNavigation = false) {
      this.persistThroughNavigation = persistThroughNavigation;
      this.subject.next({ type: 'error', text: message });
   }

}
