import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
   selector: 'app-isolate-tests-failure-dialog',
   templateUrl: './isolate-tests-failure-dialog.component.html',
   styleUrls: ['./isolate-tests-failure-dialog.component.scss']
})
export class IsolateTestsFailureDialogComponent {

   preexistingFailure: boolean;

   constructor(
      public dialogRef: MatDialogRef<IsolateTestsFailureDialogComponent, FailureEdit>,
      @Inject(MAT_DIALOG_DATA) public data: FailureEdit
   )
   {
      this.preexistingFailure = data.reason != null;
   }

   onNoClick(): void {
      this.dialogRef.close();
   }

   dismissWithDeleteRequest()
   {
      this.data.deleteRequested = true;
      this.dialogRef.close(this.data);
   }

   @HostListener('window:keydown.ENTER')
   acceptAndCloseIfComplete()
   {
      if ( !this.data.reason || this.data.reason.length === 0 )
         return;
      this.dialogRef.close(this.data);
   }
}

