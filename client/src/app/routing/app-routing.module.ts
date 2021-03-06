import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {environment} from '../../environments/environment';
import {LoginComponent} from '../login/login.component';
import {SamplesListingComponent} from '../samples-listing/samples-listing.component';
import {LabGroupContentsResolver} from './lab-group-contents.resolver';
import {TestAttachedFilesComponent} from '../common-components/test-attached-files/test-attached-files.component';
import {TestAttachedFilesResolver} from './test-attached-files.resolver';
import {ModulePreloadingStrategy} from './module-preloading-strategy';
import {AuthenticatedUserGuard} from './authenticated-user-guard';
import {AdminUserGuard} from './admin-user-guard';
import {RegistrationComponent} from '../registration/registration.component';
import {TestsSearchComponent} from '../tests-search/tests-search.component';
import {TestsSearchContextResolver} from './tests-search-context-resolver.service';

const routes: Routes = [
   {
      path: 'login',
      component: LoginComponent,
      data: {title: 'Login'},
   },
   {
      path: 'register-users',
      component: RegistrationComponent,
      data: {title: 'Register New User'},
      canActivate: [AdminUserGuard],
   },
   {
      path: 'person-inbox',
      component: SamplesListingComponent,
      resolve: { labGroupContents: LabGroupContentsResolver },
      data: {
         title: 'Inbox',
         contentsScope: 'ANALYST',
         allowDataChanges: true,
         statuses: ['S', 'I', 'T', 'M']
      },
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'lab-inbox',
      component: SamplesListingComponent,
      resolve: { labGroupContents: LabGroupContentsResolver },
      data: {
         title: 'Lab Inbox',
         contentsScope: 'LAB',
         allowDataChanges: true,
         statuses: ['P', 'A', 'S', 'I', 'T', 'O']
      },
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'tests-search',
      component: TestsSearchComponent,
      resolve: { testsSearchContext: TestsSearchContextResolver },
      data: {title: 'Tests Search'},
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'test/:testId/attached-files-editor',
      component: TestAttachedFilesComponent,
      resolve: { testAttachedFiles: TestAttachedFilesResolver },
      data: {title: 'Test-Attached Files', allowDataChanges: true},
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'test/:testId/attached-files-view',
      component: TestAttachedFilesComponent,
      resolve: { testAttachedFiles: TestAttachedFilesResolver },
      data: {title: 'Test-Attached Files View', allowDataChanges: false},
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'test-types/micro-slm',
      loadChildren: '../lab-tests/microbiology/salmonella/salmonella.module#SalmonellaModule',
      data: {title: 'Salmonella Test'},
      canActivate: [AuthenticatedUserGuard],
   },
   {
      path: 'audit-log',
      loadChildren: '../audit-log-explorer/audit-log-explorer.module#AuditLogExplorerModule',
      data: {title: 'Audit Log'},
      canActivate: [AdminUserGuard],
   },
   { path: '', redirectTo: 'person-inbox', pathMatch: 'full' },
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes, {
         enableTracing: false && !environment.production, // false => true for route tracing
         preloadingStrategy: ModulePreloadingStrategy
      })
   ],
   exports: [RouterModule],
   providers: [
      ModulePreloadingStrategy,
      AuthenticatedUserGuard,
      AdminUserGuard,
      {provide: APP_BASE_HREF, useValue: environment.baseHref}, // configures base href for PathLocationStrategy
      {provide: LocationStrategy, useClass: PathLocationStrategy},
   ],
})
export class AppRoutingModule {}
