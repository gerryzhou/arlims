import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';

import {LoadingStatusService, UserContextService} from './shared/services';
import {ViewTitleService} from './shared/services/view-title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

   loading$: Observable<boolean>;

   authenticatedUserShortName$: Observable<string | null>;
   authenticatedUserIsAdmin$: Observable<boolean>;

   pageTitle$: Observable<string | null>;
   notLoginView$: Observable<boolean>;

   constructor
      (
         public userCtxSvc: UserContextService,
         private loadingStatusService: LoadingStatusService,
         private viewTitleSvc: ViewTitleService,
         private router: Router,
         public activatedRoute: ActivatedRoute,
      )
   {
      const user$ = userCtxSvc.getAuthenticatedUser();
      this.authenticatedUserShortName$ = user$.pipe(map(au => au != null ? au.shortName : null));
      this.authenticatedUserIsAdmin$ = user$.pipe(map(au => au != null && au.roles.includes('ADMIN')));
      this.loading$ = loadingStatusService.getLoadingStatus();
      this.pageTitle$ = this.viewTitleSvc.titles();
      this.notLoginView$ = this.pageTitle$.pipe(map(title => title !== 'Login'));
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

   onLogoutClicked()
   {
      this.userCtxSvc.logout();
   }
}
