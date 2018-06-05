import { Component } from '@angular/core';
import {ApiUrlsService} from "./shared/services/api-urls.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title: string

  constructor(apiUrlsSvc: ApiUrlsService) {
     this.title = `Example API URL: ${apiUrlsSvc.authenticateUrl()}`;
  }
}
