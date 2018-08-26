import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {environment} from '../../environments/environment';
import {LoginComponent} from '../login/login.component';
import {SamplesListingComponent} from '../samples-listing/samples-listing.component';
import {LabGroupContentsResolver} from './lab-group-contents.resolver';
import {TestAttachedFilesComponent} from '../test-attached-files/test-attached-files.component';
import {TestAttachedFilesResolver} from './test-attached-files.resolver';
import {ModulePreloadingStrategy} from './module-preloading-strategy';
import {AuthenticatedUserGuard} from './authenticated-user-guard';

const routes: Routes = [
   {
      path: 'login',
      component: LoginComponent,
   },
   {
      path: 'samples',
      component: SamplesListingComponent,
      resolve: { labGroupContents: LabGroupContentsResolver },
      data: {title: 'Samples Listing'},
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'test/:testId/attached-files',
      component: TestAttachedFilesComponent,
      resolve: { testAttachedFiles: TestAttachedFilesResolver },
      data: {title: 'Test-Attached Files'},
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'test-types/micro-imp-sal-vidas',
      loadChildren: '../lab-tests/microbiology/imported-salmonella-vidas/imported-salmonella-vidas.module#ImportedSalmonellaVidasModule',
      data: {preload: true, title: 'Imported SLM Vidas Test'},
      canActivate: [AuthenticatedUserGuard],
   },
   { path: '', redirectTo: 'samples', pathMatch: 'full' },
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, {
         enableTracing: true && !environment.production, // false => true for route tracing
         preloadingStrategy: ModulePreloadingStrategy
      })
   ],
   exports: [RouterModule],
   providers: [
      ModulePreloadingStrategy,
      AuthenticatedUserGuard,
      {provide: APP_BASE_HREF, useValue: environment.baseHref}, // configures base href for PathLocationStrategy
      {provide: LocationStrategy, useClass: PathLocationStrategy},
   ],
})
export class AppRoutingModule {}
