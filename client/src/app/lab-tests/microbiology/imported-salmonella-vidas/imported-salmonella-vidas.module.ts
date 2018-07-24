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
   MatNativeDateModule,
} from '@angular/material';

import {CommonComponentsModule} from '../../../common-components/common-components.module';
import {StagePrepComponent} from './stage-prep/stage-prep.component';
import {TestDataEntryComponent} from './test-data-entry/test-data-entry.component';
import {StagePreEnrComponent} from './stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from './stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from './stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from './stage-vidas/stage-vidas.component';
import {StageControlsComponent} from './stage-controls/stage-controls.component';
import {StageResultsComponent} from './stage-results/stage-results.component';
import {StageWrapupComponent} from './stage-wrapup/stage-wrapup.component';

@NgModule({
   imports: [
      CommonModule,
      MatExpansionModule,
      ReactiveFormsModule,
      FormsModule,
      MatInputModule,
      MatCheckboxModule,
      MatSelectModule,
      MatRadioModule,
      MatSlideToggleModule,
      MatButtonModule,
      MatDatepickerModule,
      MatNativeDateModule,
      //
      CommonComponentsModule,
   ],
   declarations: [
      TestDataEntryComponent,
      StagePrepComponent,
      StagePreEnrComponent,
      StageSelEnrComponent,
      StageMBrothComponent,
      StageVidasComponent,
      StageControlsComponent,
      StageResultsComponent,
      StageWrapupComponent
   ],
   exports: [
      TestDataEntryComponent,
   ]
})
export class ImportedSalmonellaVidasModule { }
