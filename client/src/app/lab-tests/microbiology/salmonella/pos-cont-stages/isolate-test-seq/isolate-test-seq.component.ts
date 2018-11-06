import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

import {makeIsolateTestSequenceFailureFormGroup} from '../../test-data';
import {IsolateTestsFailureDialogComponent} from './isolate-tests-failure-dialog/isolate-tests-failure-dialog.component';

@Component({
   selector: 'app-isolate-test-seq',
   templateUrl: './isolate-test-seq.component.html',
   styleUrls: ['./isolate-test-seq.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsolateTestSeqComponent implements OnChanges {

   @Input()
   stage: 'SLANT' | 'IDENT';

   @Input()
   showOtherStageDataAsContext;

   @Input()
   viewOnly = false;

   @Input()
   form: FormGroup;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   @Input()
   selectiveAgarDisplayName: string;

   @Input()
   showDisposeButton = false;

   @Output()
   disposeRequested = new EventEmitter<void>();

   @Output()
   failureDeclared = new EventEmitter<void>();

   tsiFormGroup: FormGroup;
   liaFormGroup: FormGroup;

   isolateNumber: number;
   isolateDescription = '';

   formChangesSubscription: Subscription;

   constructor(private changeDetectorRef: ChangeDetectorRef, private dialogSvc: MatDialog) { }

   ngOnChanges()
   {
      // When this component's form group control is removed via another component's action,
      // this view will temporarily receive a null form group, in which case it can just render nothing.
      if ( this.form == null ) return;

      this.isolateNumber = this.form.get('isolateNumber').value;
      this.isolateDescription =
         'isolate ' + this.isolateNumber + ' in ' + this.testUnitDescription + ' / ' + this.medium + ' / ' + this.selectiveAgarDisplayName;

      this.tsiFormGroup = this.form.get('tsiTubeTest') as FormGroup;
      this.liaFormGroup = this.form.get('liaTubeTest') as FormGroup;

      if ( this.formChangesSubscription )
         this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = this.form.valueChanges.subscribe(value => {
         this.changeDetectorRef.markForCheck();
      });

   }

   onDisposeRequested()
   {
      this.disposeRequested.emit();
   }

   // Show a dialog allowing the user to add, update, or remove failure information for this test sequence.
   promptEditFailureInfo()
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

               if ( prevFailureCtl == null )
                  this.failureDeclared.emit();
            }
         }
      });
   }

   clearFailure()
   {
      this.form.removeControl('failure');
   }
}
