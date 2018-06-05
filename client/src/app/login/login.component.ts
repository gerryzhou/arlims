import { Component, OnInit } from '@angular/core';

import {ApiUrlsService} from "../shared/services/api-urls.service";


@Component({
  selector: 'lims-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   authUrl: string;

   constructor(private apiUrlsSvc: ApiUrlsService) {
      this.authUrl = apiUrlsSvc.authenticateUrl();
   }

   ngOnInit() {
   }

}
