import { Component, OnInit } from '@angular/core';
import { AlertMessageService, UserContextService } from '../shared/services';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   constructor(private userSvc: UserContextService, private alertSvc: AlertMessageService) { }

   ngOnInit() {
   }

}
