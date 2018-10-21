import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SlantTubeTest} from '../../../../test-data';
import {SlantTubeTestEditData} from './slant-tube-test-edit-data';

@Component({
   selector: 'app-edit-slant-tube-test-dialog',
   templateUrl: './edit-slant-tube-test-dialog.component.html',
   styleUrls: ['./edit-slant-tube-test-dialog.component.scss']
})
export class EditSlantTubeTestDialogComponent {

   constructor(
      public dialogRef: MatDialogRef<EditSlantTubeTestDialogComponent, SlantTubeTest>,
      @Inject(MAT_DIALOG_DATA) public data: SlantTubeTestEditData
   ) {}

   onNoClick(): void
   {
      this.dialogRef.close();
   }
}

