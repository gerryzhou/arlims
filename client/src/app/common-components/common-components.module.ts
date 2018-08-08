import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SampleComponent} from './sample/sample.component';
import {TestMetadataComponent} from './test-metadata/test-metadata.component';
import {TestStageStatusComponent} from './test-stage-status/test-stage-status.component';
import {
   MatCardModule,
   MatChipsModule,
   MatTooltipModule,
   MatButtonModule,
   MatSelectModule,
   MatDialogModule,
   MatInputModule, MatDatepickerModule, MatMenuModule
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {DayNumberPipe} from './day-number.pipe';
import {NewTestDialogComponent} from './new-test-dialog/new-test-dialog.component';
import {ConflictingFieldValueComponent} from './conflicting-field-value/conflicting-field-value.component';
import {FieldAssignedResourcesComponent} from './field-assigned-resources/field-assigned-resources.component';
import { ResourceCodesDialogComponent } from './resource-codes-dialog/resource-codes-dialog.component';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatChipsModule,
      MatTooltipModule,
      MatSelectModule,
      MatInputModule,
      MatDialogModule,
      MatDatepickerModule,
      MatMenuModule,
   ],
   declarations: [
      SampleComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      DayNumberPipe,
      NewTestDialogComponent,
      ConflictingFieldValueComponent,
      FieldAssignedResourcesComponent,
      ResourceCodesDialogComponent,
   ],
   entryComponents: [
      NewTestDialogComponent,
      ResourceCodesDialogComponent,
      // (dialog components here as well as in declarations)
   ],
   exports: [
      SampleComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      DayNumberPipe,
      ConflictingFieldValueComponent,
      FieldAssignedResourcesComponent,
   ],
})
export class CommonComponentsModule { }