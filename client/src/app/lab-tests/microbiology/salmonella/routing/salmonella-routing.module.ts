import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StagedTestDataComponent} from '../multi-stage-comps/staged-test-data/staged-test-data.component';
import {LabGroupTestDataResolver} from '../../../../routing/lab-group-test-data.resolver';
import {FormDataReviewComponent} from '../multi-stage-comps/form-data-review/form-data-review.component';
import {TestDataEntryConfirmDeactivateGuard} from './test-data-entry-confirm-deactivate-guard';
import {TestReportsListingComponent} from '../reports/reports-listing/test-reports-listing.component';

const routes: Routes = [
   // Redirect test-specific login url to the global login.
   // This way users starting from this url will have their test module preloaded prior to login
   // for better user experience (avoids confusing pause when test of given type is first clicked).
   { path: 'login', redirectTo: '/login', pathMatch: 'full' },
   {
      path: 'test-data-entry/:testId',
      component: StagedTestDataComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Edit Salmonella Test Data', allowDataChanges: true},
      canDeactivate: [TestDataEntryConfirmDeactivateGuard],
   },
   {
      path: 'test-data-view/:testId',
      component: StagedTestDataComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'View Salmonella Test Data', allowDataChanges: false},
   },
   {
      path: 'test-data-entry/:testId/stage/:stage',
      component: StagedTestDataComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Edit Salmonella Test Data', allowDataChanges: true},
      canDeactivate: [TestDataEntryConfirmDeactivateGuard],
   },
   {
      path: 'test-data-view/:testId/stage/:stage',
      component: StagedTestDataComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'View Salmonella Test Data', allowDataChanges: false},
   },
   {
      path: 'reports-listing/:testId',
      component: TestReportsListingComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {
         title: 'Test Reports - Salmonella',
         includeAuditLogEntries: true,
      },
   },
   {
      path: 'reports/form-data-review/:testId',
      component: FormDataReviewComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {
         title: 'Salmonella Test Data Review',
         includeAuditLogEntries: true,
      },
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class SalmonellaRoutingModule { }
