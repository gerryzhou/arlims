import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StagedTestDataEntryComponent} from './staged-test-data-entry/staged-test-data-entry.component';
import {LabGroupTestDataResolver} from '../../../routing/lab-group-test-data.resolver';

const routes: Routes = [
   {
      path: 'test-data-entry/:testId',
      component: StagedTestDataEntryComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver }
   },
   {
      path: 'test-data-entry/:testId/stage/:stage',
      component: StagedTestDataEntryComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver }
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ImportedSalmonellaVidasRoutingModule { }
