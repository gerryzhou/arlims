import { Component, OnInit } from '@angular/core';
import {LoadingIndicatorService, AlertMessageService, UserContextService} from './shared/services';
import {AuthenticatedUser} from '../generated/dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

   loading: boolean;

   authenticatedUser: AuthenticatedUser;

   constructor(private userCtxSvc: UserContextService, private loadingIndicatorService: LoadingIndicatorService) {
      this.authenticatedUser = userCtxSvc.authenticatedUser;
      this.loading = false;
      loadingIndicatorService.onLoadingChanged.subscribe(isLoading => this.loading = isLoading);
   }

   ngOnInit(): void { }
}
