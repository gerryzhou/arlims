import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {
   MatCheckboxModule,
   MatExpansionModule,
   MatInputModule,
   MatRadioModule,
   MatButtonToggleModule,
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
   MatTabsModule,
   MatDividerModule,
} from '@angular/material';

import {CommonComponentsModule} from '../../../common-components/common-components.module';
import {FactsPostingService} from './facts-posting.service';
import {SalmonellaRoutingModule} from './routing/salmonella-routing.module';
import {TestDataEntryConfirmDeactivateGuard} from './routing/test-data-entry-confirm-deactivate-guard';
import {StagedTestDataComponent} from './multi-stage-comps/staged-test-data/staged-test-data.component';
import {FormDataReviewComponent} from './multi-stage-comps/form-data-review/form-data-review.component';
import {TestReportsListingComponent} from './reports/reports-listing/test-reports-listing.component';
import {StagePrepComponent} from './stage-comps/stage-prep/stage-prep.component';
import {StagePreEnrComponent} from './stage-comps/stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from './stage-comps/stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from './stage-comps/stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from './stage-comps/stage-vidas/stage-vidas.component';
import {PosContComponent} from './stage-comps/pos-cont-stages/pos-cont.component';
import {StageWrapupComponent} from './stage-comps/stage-wrapup/stage-wrapup.component';
import {OnePosTestUnitContTestsComponent} from './stage-comps/pos-cont-stages/one-pos-test-unit-cont-tests/one-pos-test-unit-cont-tests.component';
import {SelAgarsTestSuiteComponent} from './stage-comps/pos-cont-stages/sel-agars-test-suite/sel-agars-test-suite.component';
import {IsolateTestSeqComponent} from './stage-comps/pos-cont-stages/isolate-test-seq/isolate-test-seq.component';
import {IsolateTestsFailureDialogComponent} from './stage-comps/pos-cont-stages/isolate-test-seq/isolate-tests-failure-dialog/isolate-tests-failure-dialog.component';
import {IsolateSlantStageViewComponent} from './stage-comps/pos-cont-stages/isolate-slant-stage-view/isolate-slant-stage-view.component';
import {IsolateSlantStageEditorComponent} from './stage-comps/pos-cont-stages/isolate-slant-stage-editor/isolate-slant-stage-editor.component';
import {IsolateSlantTubeViewComponent} from './stage-comps/pos-cont-stages/isolate-slant-tube-view/isolate-slant-tube-view.component';
import {IsolateSlantTubeEditorComponent} from './stage-comps/pos-cont-stages/isolate-slant-tube-editor/isolate-slant-tube-editor.component';
import {IsolateIdentificationViewComponent} from './stage-comps/pos-cont-stages/isolate-identification-view/isolate-identification-view.component';
import {IsolateIdentificationEditorComponent} from './stage-comps/pos-cont-stages/isolate-identification-editor/isolate-identification-editor.component';

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
      MatButtonToggleModule,
      MatSlideToggleModule,
      MatButtonModule,
      MatDatepickerModule,
      MatIconModule,
      MatStepperModule,
      MatMenuModule,
      MatCardModule,
      MatDialogModule,
      MatTooltipModule,
      MatTabsModule,
      MatDividerModule,
      //
      CommonComponentsModule,
      SalmonellaRoutingModule,
   ],
   declarations: [
      StagedTestDataComponent,
      FormDataReviewComponent,
      StagePrepComponent,
      StagePreEnrComponent,
      StageSelEnrComponent,
      StageMBrothComponent,
      StageVidasComponent,
      PosContComponent,
      StageWrapupComponent,
      TestReportsListingComponent,
      OnePosTestUnitContTestsComponent,
      SelAgarsTestSuiteComponent,
      IsolateTestSeqComponent,
      IsolateTestsFailureDialogComponent,
      IsolateSlantStageViewComponent,
      IsolateSlantStageEditorComponent,
      IsolateSlantTubeViewComponent,
      IsolateSlantTubeEditorComponent,
      IsolateIdentificationViewComponent,
      IsolateIdentificationEditorComponent,
   ],
   providers: [
      TestDataEntryConfirmDeactivateGuard,
      FactsPostingService,
   ],
   entryComponents: [
      IsolateTestsFailureDialogComponent,
   ],
   exports: []
})
export class SalmonellaModule { }
