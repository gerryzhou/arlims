import {Component, HostListener, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {IsolateSlantStageEditDialogInputData} from './isolate-slant-stage-edit-dialog-input-data';
import {IsolateTestSequence, makeEmptyIsolateTestSequence, makeIsolateTestSequenceFormGroup} from '../../../test-data';

@Component({
   selector: 'app-isolate-slant-stage-edit-dialog',
   templateUrl: './isolate-slant-stage-edit-dialog.component.html',
   styleUrls: ['./isolate-slant-stage-edit-dialog.component.scss'],
})
export class IsolateSlantStageEditDialogComponent {

   form: FormGroup;

   editableIsolateNumber: boolean;

   includeOxidase = true;

   showUnsetAffordances = false;

   isolateDescription: string ;

   constructor
       (
          public dialogRef: MatDialogRef<IsolateSlantStageEditDialogComponent, IsolateTestSequence>,
          @Inject(MAT_DIALOG_DATA) inputData: IsolateSlantStageEditDialogInputData
       )
   {
      this.editableIsolateNumber = inputData.editableIsolateNumber;
      const isolateTestSeq = inputData.isolateTestSequence || makeEmptyIsolateTestSequence(null);

      this.includeOxidase = inputData.includeOxidase;
      this.showUnsetAffordances = inputData.showUnsetAffordances;
      this.isolateDescription =
         (isolateTestSeq.isolateNumber ? `Isolate ${isolateTestSeq.isolateNumber}` : `New isolate`) +
         ` in ${inputData.medium}/${inputData.selectiveAgarDisplayName}, ` +
         `${inputData.testUnitDescription}`;

      this.form = makeIsolateTestSequenceFormGroup(new FormBuilder(), isolateTestSeq);
   }

   onNoClick(): void
   {
      this.dialogRef.close();
   }

   @HostListener('window:keydown.ENTER')
   acceptAndCloseIfValid()
   {
      // Must at least have an isolate number.
      if ( !this.form.get('isolateNumber').value )
         return;

      this.dialogRef.close(this.form.value);
   }

}
