import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingStatusService, UserContextService} from './shared/services';
import {AuthenticatedUser} from '../generated/dto';
import {Observable, Subscription} from 'rxjs';
import {ViewTitleService} from './shared/services/view-title.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

   loading: boolean;
   authenticatedUser: AuthenticatedUser;

   pageTitle$: Observable<string | null>;

   private loadingStatusSubscription: Subscription;

   constructor
      (
         private userCtxSvc: UserContextService,
         private loadingStatusService: LoadingStatusService,
         private viewTitleSvc: ViewTitleService,
         private router: Router,
         private activatedRoute: ActivatedRoute,
      )
   {
      this.authenticatedUser = userCtxSvc.authenticatedUser;
      this.loading = false;
      this.loadingStatusSubscription = loadingStatusService.loadingStatus.subscribe(loading => this.loading = loading);
      this.pageTitle$ = this.viewTitleSvc.titles();
   }

   ngOnInit()
   {
      this.router.events.pipe(
         filter((event) => event instanceof NavigationEnd),
         map(() => this.activatedRoute),
         map((route: ActivatedRoute) => {
            while (route.firstChild) route = route.firstChild;
            return route;
         }),
         filter((route: ActivatedRoute) => route.outlet === 'primary'),
         mergeMap((route: ActivatedRoute) => route.data)
      )
      .subscribe((data) => this.viewTitleSvc.setTitle(data['title'] || null));
   }

   ngOnDestroy()
   {
      this.loadingStatusSubscription.unsubscribe();
   }

}
