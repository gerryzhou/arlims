import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {environment} from '../../environments/environment';
import {HomeComponent} from '../home/home.component';


const routes: Routes = [
   {
      path: 'home',
      component: HomeComponent,
   },
   { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
   imports: [RouterModule.forRoot(routes, {enableTracing: false && !environment.production})], // false => true for route tracing
   exports: [RouterModule],
   providers: [
      {provide: APP_BASE_HREF, useValue: environment.baseHref}, // configures base href for PathLocationStrategy
      {provide: LocationStrategy, useClass: PathLocationStrategy},
   ],
})
export class AppRoutingModule {}
