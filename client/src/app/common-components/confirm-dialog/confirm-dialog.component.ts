import {Component, HostListener, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

   titleSubject: string;

   confirmMessage: string;

   constructor
      (
         public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
         @Inject(MAT_DIALOG_DATA) public data: any
      )
   {
      this.titleSubject = data.titleSubject;
      this.confirmMessage = data.confirmMessage;
   }


   @HostListener('window:keydown.ENTER')
   acceptAndClose()
   {
      this.dialogRef.close(true);
   }

}
