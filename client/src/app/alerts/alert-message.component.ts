import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {AlertMessageService, AlertMessage} from "../shared/services/alert-messages";


@Component({
  selector: 'lims-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit, OnDestroy {

   private messagesSubscription: Subscription;

   private _message: AlertMessage;

   constructor(private alertMessageService: AlertMessageService) { }

   get message(): AlertMessage { return this._message; }

   ngOnInit() {
      this.messagesSubscription = this.alertMessageService.messages().subscribe(msg => {
         this._message = msg;
      });
   }

   ngOnDestroy() {
      this.messagesSubscription.unsubscribe();
   }
}