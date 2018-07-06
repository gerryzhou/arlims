import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {environment} from '../../environments/environment';
import {SamplesListingComponent} from '../samples-listing/samples-listing.component';
import {LabGroupContentsResolver} from './lab-group-contents.resolver';


const routes: Routes = [
   {
      path: 'samples',
      component: SamplesListingComponent,
      resolve: { labGroupContents: LabGroupContentsResolver }
   },
   { path: '', redirectTo: 'samples', pathMatch: 'full' },
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
