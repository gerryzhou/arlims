import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {
   MatCheckboxModule,
   MatExpansionModule,
   MatInputModule,
   MatRadioModule,
   MatSelectModule,
   MatSlideToggleModule,
   MatButtonModule,
   MatDatepickerModule,
   MatIconModule,
   MatStepperModule,
   MatMenuModule,
   MatCardModule,
   MatDialogModule,
   MatTooltipModule,
} from '@angular/material';

import {CommonComponentsModule} from '../../../common-components/common-components.module';
import {SalmonellaRoutingModule} from './routing/salmonella-routing.module';
import {StagePrepComponent} from './stage-prep/stage-prep.component';
import {StagedTestDataEntryComponent} from './staged-test-data-entry/staged-test-data-entry.component';
import {StagePreEnrComponent} from './stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from './stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from './stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from './stage-vidas/stage-vidas.component';
import {StageControlsComponent} from './stage-controls/stage-controls.component';
import {StagePosContComponent} from './stage-pos-cont/stage-pos-cont.component';
import {StageWrapupComponent} from './stage-wrapup/stage-wrapup.component';
import {TestDataEntryConfirmDeactivateGuard} from './routing/test-data-entry-confirm-deactivate-guard';
import {TestReportsListingComponent} from './reports/reports-listing/test-reports-listing.component';
import {FormDataReviewComponent} from './form-data-review/form-data-review.component';
import {OnePosTestUnitContTestsComponent} from './stage-pos-cont/one-pos-test-unit-cont-tests/one-pos-test-unit-cont-tests.component';
import {SelAgarsTestSuiteComponent} from './stage-pos-cont/sel-agars-test-suite/sel-agars-test-suite.component';
import {IsolateTestSeqComponent} from './stage-pos-cont/isolate-test-seq/isolate-test-seq.component';
import {IsolateTestsFailureDialogComponent} from './stage-pos-cont/isolate-test-seq/isolate-tests-failure-dialog/isolate-tests-failure-dialog.component';
import {EditSlantTubeTestDialogComponent} from './stage-pos-cont/isolate-test-seq/slant-tube-test/edit-slant-tube-test-dialog/edit-slant-tube-test-dialog.component';
import {SlantTubeTestComponent} from './stage-pos-cont/isolate-test-seq/slant-tube-test/slant-tube-test.component';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      MatExpansionModule,
      ReactiveFormsModule,
      MatInputModule,
      MatCheckboxModule,
      MatSelectModule,
      MatRadioModule,
      MatSlideToggleModule,
      MatButtonModule,
      MatDatepickerModule,
      MatIconModule,
      MatStepperModule,
      MatMenuModule,
      MatCardModule,
      MatDialogModule,
      MatTooltipModule,
      //
      CommonComponentsModule,
      SalmonellaRoutingModule,
   ],
   declarations: [
      StagedTestDataEntryComponent,
      FormDataReviewComponent,
      StagePrepComponent,
      StagePreEnrComponent,
      StageSelEnrComponent,
      StageMBrothComponent,
      StageVidasComponent,
      StageControlsComponent,
      StagePosContComponent,
      StageWrapupComponent,
      TestReportsListingComponent,
      OnePosTestUnitContTestsComponent,
      SelAgarsTestSuiteComponent,
      IsolateTestSeqComponent,
      IsolateTestsFailureDialogComponent,
      EditSlantTubeTestDialogComponent,
      SlantTubeTestComponent,
   ],
   providers: [
      TestDataEntryConfirmDeactivateGuard,
   ],
   entryComponents: [
      IsolateTestsFailureDialogComponent,
      EditSlantTubeTestDialogComponent,
   ],
   exports: []
})
export class SalmonellaModule { }
