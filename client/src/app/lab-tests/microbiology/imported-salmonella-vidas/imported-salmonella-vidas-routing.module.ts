import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {StagedTestDataEntryComponent} from './staged-test-data-entry/staged-test-data-entry.component';
import {LabGroupTestDataResolver} from '../../../routing/lab-group-test-data.resolver';
import {TestDataViewComponent} from './test-data-view/test-data-view.component';

const routes: Routes = [
   {
      path: 'test-data-entry/:testId',
      component: StagedTestDataEntryComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Imported SLM Vidas Test Data Entry'},
   },
   {
      path: 'test-data-entry/:testId/stage/:stage',
      component: StagedTestDataEntryComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Imported SLM Vidas Test Data Entry'},
   },
   {
      path: 'test-data-view/:testId',
      component: TestDataViewComponent,
      resolve: { labGroupTestData: LabGroupTestDataResolver },
      data: {title: 'Imported SLM Vidas Test Data Review'},
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ImportedSalmonellaVidasRoutingModule { }
