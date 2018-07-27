import {Component, OnDestroy} from '@angular/core';
import {LoadingStatusService, UserContextService} from './shared/services';
import {AuthenticatedUser} from '../generated/dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

   loading: boolean;
   authenticatedUser: AuthenticatedUser;

   private loadingStatusSubscription: any;


   constructor(private userCtxSvc: UserContextService, private loadingStatusService: LoadingStatusService) {
      this.authenticatedUser = userCtxSvc.authenticatedUser;
      this.loading = false;
      this.loadingStatusSubscription =
         loadingStatusService.loadingStatus.subscribe(isLoading => this.loading = isLoading);
   }

   ngOnDestroy(): void {
      this.loadingStatusSubscription.unsubscribe();
   }

}
