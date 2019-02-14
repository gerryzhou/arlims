import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

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
   MatInputModule,
   MatDatepickerModule,
   MatMenuModule,
   MatTableModule,
   MatPaginatorModule,
   MatListModule,
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {DayNumberPipe} from './day-number.pipe';
import {PlusMinusPipe} from './plus-minus.pipe';
import {NewTestDialogComponent} from './new-test-dialog/new-test-dialog.component';
import {ConflictingFieldValueComponent} from './conflicting-field-value/conflicting-field-value.component';
import {FieldAssignedResourcesComponent} from './field-assigned-resources/field-assigned-resources.component';
import {ResourceCodesDialogComponent} from './resource-codes-dialog/resource-codes-dialog.component';
import {FilesSelectorComponent} from './files-selector/files-selector.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {SimpleInputDialogComponent} from './simple-input-dialog/simple-input-dialog.component';
import {AuditLogEntryComponent} from './audit-log-entry/audit-log-entry.component';
import {DataFieldDiffsComponent} from './data-field-diffs/data-field-diffs.component';
import {TestAttachedFilesComponent} from './test-attached-files/test-attached-files.component';
import {AttachedFileMetadataDialogComponent} from './attached-file-metadata-dialog/attached-file-metadata-dialog.component';
import {TimeChargesComponent} from './time-charges/time-charges.component';
import {UserTimeChargeDialogComponent} from './time-charges/time-charge-dialog/user-time-charge-dialog.component';
import {ItemsSelectionDialogComponent} from './items-selection-dialog/items-selection-dialog.component';

@NgModule({
   imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule,
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
      MatTableModule,
      MatPaginatorModule,
      MatListModule
   ],
   declarations: [
      SampleComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      DayNumberPipe,
      PlusMinusPipe,
      NewTestDialogComponent,
      ConflictingFieldValueComponent,
      FieldAssignedResourcesComponent,
      ResourceCodesDialogComponent,
      FilesSelectorComponent,
      ConfirmDialogComponent,
      SimpleInputDialogComponent,
      AuditLogEntryComponent,
      DataFieldDiffsComponent,
      TestAttachedFilesComponent,
      AttachedFileMetadataDialogComponent,
      TimeChargesComponent,
      UserTimeChargeDialogComponent,
      ItemsSelectionDialogComponent,
   ],
   entryComponents: [
      NewTestDialogComponent,
      ResourceCodesDialogComponent,
      ConfirmDialogComponent,
      SimpleInputDialogComponent,
      AttachedFileMetadataDialogComponent,
      UserTimeChargeDialogComponent,
      ItemsSelectionDialogComponent,
      // (dialog components here as well as in declarations)
   ],
   exports: [
      SampleComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      DayNumberPipe,
      PlusMinusPipe,
      NewTestDialogComponent,
      ConflictingFieldValueComponent,
      FieldAssignedResourcesComponent,
      ResourceCodesDialogComponent,
      FilesSelectorComponent,
      ConfirmDialogComponent,
      SimpleInputDialogComponent,
      AuditLogEntryComponent,
      DataFieldDiffsComponent,
      TestAttachedFilesComponent,
      TimeChargesComponent,
      UserTimeChargeDialogComponent,
   ],
})
export class CommonComponentsModule { }
