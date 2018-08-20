import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { Subscription } from 'rxjs';

import {AlertMessageService, AlertMessage} from '../shared/services/alerts';


@Component({
   selector: 'app-alert-message',
   templateUrl: './alert-message.component.html',
   styleUrls: ['./alert-message.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertMessageComponent implements OnInit, OnDestroy {

   private messagesSubscription: Subscription;

   private _message: AlertMessage | null = null;

   constructor(private alertMessageService: AlertMessageService) { }

   get message(): AlertMessage | null { return this._message; }

   clear() {
      this._message = null;
   }

   ngOnInit() {
      this.messagesSubscription = this.alertMessageService.messages().subscribe(msg => {
         this._message = msg;
      });
   }

   ngOnDestroy() {
      this.messagesSubscription.unsubscribe();
   }
}
