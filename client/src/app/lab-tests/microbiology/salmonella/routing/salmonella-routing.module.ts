import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StagedTestDataEntryComponent} from '../staged-test-data-entry/staged-test-data-entry.component';
import {LabGroupTestDataResolver} from '../../../../routing/lab-group-test-data.resolver';
import {FormDataReviewComponent} from '../form-data-review/form-data-review.component';
import {TestDataEntryConfirmDeactivateGuard} from './test-data-entry-confirm-deactivate-guard';
import {TestReportsListingComponent} from '../reports/reports-listing/test-reports-listing.component';

const routes: Routes = [
   {
      path: 'test-data-entry/:testId',
      component: StagedTestDataEntryComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Salmonella Test Data Entry'},
      canDeactivate: [TestDataEntryConfirmDeactivateGuard],
   },
   {
      path: 'test-data-entry/:testId/stage/:stage',
      component: StagedTestDataEntryComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Salmonella Test Data Entry'},
      canDeactivate: [TestDataEntryConfirmDeactivateGuard],
   },
   {
      path: 'reports-listing/:testId',
      component: TestReportsListingComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {
         title: 'Test Reports - Salmonella',
         includeAuditLogEntries: true, // tell resolver to also load audit log entries
      },
   },
   {
      path: 'reports/form-data-review/:testId',
      component: FormDataReviewComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {
         title: 'Salmonella Test Data Review',
         includeAuditLogEntries: true, // tell resolver to also load audit log entries
      },
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class SalmonellaRoutingModule { }
