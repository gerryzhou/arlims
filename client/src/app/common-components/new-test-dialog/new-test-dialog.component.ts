import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NewTestInfo} from './new-test-info';

@Component({
  selector: 'app-new-test-dialog',
  templateUrl: './new-test-dialog.component.html',
  styleUrls: ['./new-test-dialog.component.scss']
})
export class NewTestDialogComponent {

   constructor(
      public dialogRef: MatDialogRef<NewTestInfo>,
      @Inject(MAT_DIALOG_DATA) public data: NewTestInfo
   ) {}

   onNoClick(): void {
      this.dialogRef.close();
   }

}

