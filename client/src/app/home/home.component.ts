import { Component, OnInit } from '@angular/core';
import { AlertMessageService, UserService } from '../shared/services';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   constructor(private userSvc: UserService, private alertsSvc: AlertMessageService) { }

   ngOnInit() {
      this.alertsSvc.alertInfo(`Welcome, ${this.userSvc.userContext}`);
   }

}
