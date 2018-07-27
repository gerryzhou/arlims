import {Component, OnDestroy} from '@angular/core';
import {LoadingStatusService, UserContextService} from './shared/services';
import {AuthenticatedUser} from '../generated/dto';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

   loading: boolean;
   authenticatedUser: AuthenticatedUser;

   private loadingStatusSubscription: Subscription;


   constructor(private userCtxSvc: UserContextService, private loadingStatusService: LoadingStatusService) {
      this.authenticatedUser = userCtxSvc.authenticatedUser;
      this.loading = false;
      this.loadingStatusSubscription = loadingStatusService.loadingStatus.subscribe(loading => this.loading = loading);
   }

   ngOnDestroy(): void {
      this.loadingStatusSubscription.unsubscribe();
   }

}
