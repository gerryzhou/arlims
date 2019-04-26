import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';

import {IsolateTestSequence} from '../../../test-data';
import {IsolateSlantStageEditDialogComponent} from '../isolate-slant-stage-edit-dialog/isolate-slant-stage-edit-dialog.component';
import {IsolateSlantStageEditDialogInputData} from '../isolate-slant-stage-edit-dialog/isolate-slant-stage-edit-dialog-input-data';

@Component({
   selector: 'app-isolate-slant-stage-view',
   templateUrl: './isolate-slant-stage-view.component.html',
   styleUrls: ['./isolate-slant-stage-view.component.scss'],
})
export class IsolateSlantStageViewComponent {

   @Input()
   form: FormGroup; // isolate test seq form group

   @Input()
   allowDataChanges: boolean;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   @Input()
   selectiveAgarDisplayName: string;

   @Input()
   includeOxidase = true;

   @Input()
   showUnsetAffordances: boolean;


   constructor
      (
         private dialogSvc: MatDialog
      )
   {}

   promptEditIfEditable()
   {
      if ( !this.allowDataChanges || this.form.controls.failure )
         return;

      const inputData: IsolateSlantStageEditDialogInputData = {
         editableIsolateNumber: false,
         isolateTestSequence: this.form.value,
         includeOxidase: this.includeOxidase,
         testUnitDescription: this.testUnitDescription,
         medium: this.medium,
         selectiveAgarDisplayName: this.selectiveAgarDisplayName,
         showUnsetAffordances: this.showUnsetAffordances,
      };

      const dlg = this.dialogSvc.open(IsolateSlantStageEditDialogComponent, {
         data: inputData
      });

      dlg.afterClosed().subscribe((isolateTestSeq: IsolateTestSequence) => {
         if ( isolateTestSeq )
         {
            this.form.patchValue(isolateTestSeq);
         }
      });
   }

}
