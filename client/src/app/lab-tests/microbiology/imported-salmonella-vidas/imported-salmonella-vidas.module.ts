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
} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

import {CommonComponentsModule} from '../../../common-components/common-components.module';
import {ImportedSalmonellaVidasRoutingModule} from './routing/imported-salmonella-vidas-routing.module';
import {StagePrepComponent} from './stage-prep/stage-prep.component';
import {StagedTestDataEntryComponent} from './staged-test-data-entry/staged-test-data-entry.component';
import {StagePreEnrComponent} from './stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from './stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from './stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from './stage-vidas/stage-vidas.component';
import {StageControlsComponent} from './stage-controls/stage-controls.component';
import {StageWrapupComponent} from './stage-wrapup/stage-wrapup.component';
import {TestDataViewComponent} from './test-data-view/test-data-view.component';
import {TestDataEntryConfirmDeactivateGuard} from './routing/test-data-entry-confirm-deactivate-guard';

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
      MatMomentDateModule,
      MatIconModule,
      MatStepperModule,
      MatMenuModule,
      //
      CommonComponentsModule,
      ImportedSalmonellaVidasRoutingModule,
   ],
   declarations: [
      StagedTestDataEntryComponent,
      TestDataViewComponent,
      StagePrepComponent,
      StagePreEnrComponent,
      StageSelEnrComponent,
      StageMBrothComponent,
      StageVidasComponent,
      StageControlsComponent,
      StageWrapupComponent
   ],
   providers: [
      TestDataEntryConfirmDeactivateGuard,
   ],
   exports: []
})
export class ImportedSalmonellaVidasModule { }
