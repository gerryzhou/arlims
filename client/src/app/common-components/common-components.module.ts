import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SampleComponent} from './sample/sample.component';
import {TestComponent} from './test/test.component';
import {TestStageStatusComponent} from './test-stage-status/test-stage-status.component';
import {DayNumberPipe} from './day-number.pipe';
import {PlusMinusPipe} from './plus-minus.pipe';
import {NewTestDialogComponent} from './new-test-dialog/new-test-dialog.component';
import {ConflictingFieldValueComponent} from './conflicting-field-value/conflicting-field-value.component';
import {FieldAssignedResourcesComponent} from './field-assigned-resources/field-assigned-resources.component';
import {ResourceCodesDialogComponent} from './resource-codes-dialog/resource-codes-dialog.component';
import {FilesSelectorComponent} from './files-selector/files-selector.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {TextInputDialogComponent} from './text-input-dialog/text-input-dialog.component';
import {AuditLogEntryComponent} from './audit-log-entry/audit-log-entry.component';
import {DataFieldDiffsComponent} from './data-field-diffs/data-field-diffs.component';
import {TestAttachedFilesComponent} from './test-attached-files/test-attached-files.component';
import {AttachedFileMetadataDialogComponent} from './attached-file-metadata-dialog/attached-file-metadata-dialog.component';
import {TimeChargesComponent} from './time-charges/time-charges.component';
import {UserTimeChargeDialogComponent} from './time-charges/time-charge-dialog/user-time-charge-dialog.component';
import {ItemsSelectionDialogComponent} from './items-selection-dialog/items-selection-dialog.component';
import {MaterialUiModule} from '../material-ui.module';

@NgModule({
   imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule,
      MaterialUiModule,
   ],
   declarations: [
      SampleComponent,
      TestComponent,
      TestStageStatusComponent,
      DayNumberPipe,
      PlusMinusPipe,
      NewTestDialogComponent,
      ConflictingFieldValueComponent,
      FieldAssignedResourcesComponent,
      ResourceCodesDialogComponent,
      FilesSelectorComponent,
      ConfirmDialogComponent,
      TextInputDialogComponent,
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
      TextInputDialogComponent,
      AttachedFileMetadataDialogComponent,
      UserTimeChargeDialogComponent,
      ItemsSelectionDialogComponent,
      // (dialog components here as well as in declarations)
   ],
   exports: [
      SampleComponent,
      TestComponent,
      TestStageStatusComponent,
      DayNumberPipe,
      PlusMinusPipe,
      NewTestDialogComponent,
      ConflictingFieldValueComponent,
      FieldAssignedResourcesComponent,
      ResourceCodesDialogComponent,
      FilesSelectorComponent,
      ConfirmDialogComponent,
      TextInputDialogComponent,
      AuditLogEntryComponent,
      DataFieldDiffsComponent,
      TestAttachedFilesComponent,
      TimeChargesComponent,
      UserTimeChargeDialogComponent,
      ItemsSelectionDialogComponent,
   ],
})
export class CommonComponentsModule {}
