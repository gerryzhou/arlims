import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {environment} from '../../environments/environment';
import {SamplesListingComponent} from '../samples-listing/samples-listing.component';
import {LabGroupContentsResolver} from './lab-group-contents.resolver';
import {StagedTestDataEntryComponent as MicroImpSalVidasTestDataComponent} from '../lab-tests/microbiology/imported-salmonella-vidas/staged-test-data-entry/staged-test-data-entry.component';
import {LabGroupTestDataResolver} from './lab-group-test-data.resolver';
import {TestAttachedFilesComponent} from '../test-attached-files/test-attached-files.component';
import {TestAttachedFilesResolver} from './test-attached-files.resolver';

const routes: Routes = [
   {
      path: 'samples',
      component: SamplesListingComponent,
      resolve: { labGroupContents: LabGroupContentsResolver }
   },
   {
      path: 'test/:testId/attached-files',
      component: TestAttachedFilesComponent,
      resolve: { testAttachedFiles: TestAttachedFilesResolver }
   },
   {
      path: 'test-data/MICRO_IMP_SAL_VIDAS/:testId',
      component: MicroImpSalVidasTestDataComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver }
   },
   {
      path: 'test-data/MICRO_IMP_SAL_VIDAS/:testId/:stage',
      component: MicroImpSalVidasTestDataComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver }
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
