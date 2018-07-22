import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {environment} from '../../environments/environment';
import {SamplesListingComponent} from '../samples-listing/samples-listing.component';
import {LabGroupContentsResolver} from './lab-group-contents.resolver';
import {TestDataEntryComponent as MicroImpSalVidasTestDataComponent} from '../lab-tests/microbiology/imported-salmonella-vidas/test-data-entry/test-data-entry.component';
import {TestDataResolver} from './test-data.resolver';

const routes: Routes = [
   {
      path: 'samples',
      component: SamplesListingComponent,
      resolve: { labGroupContents: LabGroupContentsResolver }
   },
   {
      path: 'test-data/MICRO_IMP_SAL_VIDAS/:testId',
      component: MicroImpSalVidasTestDataComponent,
      resolve: { testData: TestDataResolver }
   },
   {
      path: 'test-data/MICRO_IMP_SAL_VIDAS/:testId/:phase',
      component: MicroImpSalVidasTestDataComponent,
      resolve: { testData: TestDataResolver }
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
