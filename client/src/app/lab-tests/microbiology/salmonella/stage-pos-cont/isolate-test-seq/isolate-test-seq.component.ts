import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FormGroup} from '@angular/forms';

import {makeIsolateTestSequenceFailureFormGroup} from '../../test-data';
import {IsolateTestsFailureDialogComponent} from './isolate-tests-failure-dialog/isolate-tests-failure-dialog.component';

@Component({
   selector: 'app-isolate-test-seq',
   templateUrl: './isolate-test-seq.component.html',
   styleUrls: ['./isolate-test-seq.component.scss']
})
export class IsolateTestSeqComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   @Input()
   selectiveAgarDisplayName: string;

   @Input()
   isolateNumber: number;

   @Input()
   showDisposeButton = false;

   @Output()
   disposeRequested = new EventEmitter<void>();

   @Output()
   failureDeclared = new EventEmitter<void>();

   isolateDescription = '';
   failed: boolean;

   constructor(private dialogSvc: MatDialog) { }

   ngOnChanges()
   {
      this.isolateDescription = 'isolate ' + this.isolateNumber + ' in ' +
         this.testUnitDescription + ' / ' + this.medium + ' / ' + this.selectiveAgarDisplayName;
      this.failed = this.form.controls.failure != null;
   }

   onDisposeRequested()
   {
      this.disposeRequested.emit();
   }

   // Show a dialog allowing the user to add, update, or remove failure information for this test sequence.
   promptEditFailure()
   {
      const prevFailureCtl = this.form.get('failure') as FormGroup;
      const reason = prevFailureCtl != null ? prevFailureCtl.controls.reason.value : null;
      const notes = prevFailureCtl != null ? prevFailureCtl.controls.notes.value : null;

      const dlg = this.dialogSvc.open(IsolateTestsFailureDialogComponent, {
         width: 'calc(65%)',
         data: {
            reason: reason,
            notes: notes,
         }
      });

      dlg.afterClosed().subscribe((failureEdit: FailureEdit) => {
         if ( failureEdit )
         {
            if ( failureEdit.deleteRequested )
               this.clearFailure();
            else
            {
               if ( prevFailureCtl != null )
                  this.form.removeControl('failure');
               const failure = {
                  declaredAt: new Date().toISOString(),
                  reason: failureEdit.reason,
                  notes: failureEdit.notes,
               };
               this.form.addControl('failure', makeIsolateTestSequenceFailureFormGroup(failure));
               this.failed = true;

               if ( prevFailureCtl == null )
                  this.failureDeclared.emit();
            }
         }
      });
   }

   clearFailure()
   {
      this.form.removeControl('failure');
      this.failed = false;
   }

   cycleOxidaseDetection()
   {
      const oxCtl = this.form.get('oxidaseDetection');
      const v = oxCtl.value as boolean;
      oxCtl.setValue(v == null ? true : v === true ? false : null);
   }
}
