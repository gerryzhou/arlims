import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewTestInfo} from './new-test-info';

@Component({
  selector: 'app-new-test-dialog',
  templateUrl: './new-test-dialog.component.html',
  styleUrls: ['./new-test-dialog.component.scss']
})
export class NewTestDialogComponent {

   constructor(
      public dialogRef: MatDialogRef<NewTestDialogComponent, NewTestInfo>,
      @Inject(MAT_DIALOG_DATA) public data: NewTestInfo
   ) {}

   onNoClick(): void {
      this.dialogRef.close();
   }

   @HostListener('window:keydown.ENTER')
   acceptAndCloseIfValid()
   {
      if ( !this.data.beginDate || !this.data.selectedTestType )
         return;
      this.dialogRef.close(this.data);
   }
}

