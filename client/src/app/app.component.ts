import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingStatusService, UserContextService} from './shared/services';
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

   authenticatedUserShortName$: Observable<string | null>;
   authenticatedUserIsAdmin$: Observable<boolean>;

   pageTitle$: Observable<string | null>;

   private loadingStatusSubscription: Subscription;

   constructor
      (
         public userCtxSvc: UserContextService,
         private loadingStatusService: LoadingStatusService,
         private viewTitleSvc: ViewTitleService,
         private router: Router,
         private activatedRoute: ActivatedRoute,
      )
   {
      const user$ = userCtxSvc.getAuthenticatedUser();
      this.authenticatedUserShortName$ = user$.pipe(map(au => au != null ? au.shortName : null));
      this.authenticatedUserIsAdmin$ = user$.pipe(map(au => au != null && au.roles.includes('ADMIN')));
      this.loading = false;
      this.loadingStatusSubscription = loadingStatusService.loadingStatus.subscribe(loading => this.loading = loading);
      this.pageTitle$ = this.viewTitleSvc.titles();
   }

   ngOnInit()
   {
      // (Derived from https://toddmotto.com/dynamic-page-titles-angular-2-router-events)
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

   onLogoutClicked()
   {
      this.userCtxSvc.logout();
   }
}
