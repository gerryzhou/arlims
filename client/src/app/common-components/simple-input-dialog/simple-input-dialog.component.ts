import {Component, HostListener, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-simple-input-dialog',
  templateUrl: './simple-input-dialog.component.html',
  styleUrls: ['./simple-input-dialog.component.scss']
})
export class SimpleInputDialogComponent {

   title: string;
   message: string;
   input: string = null;

   constructor
      (
         public dialogRef: MatDialogRef<SimpleInputDialogComponent, string>,
         @Inject(MAT_DIALOG_DATA) public data: any
      )
   {
      this.title = data.title;
      this.message = data.message;
   }


   @HostListener('window:keydown.ENTER')
   acceptAndClose()
   {
      this.dialogRef.close(this.input);
   }

}
