import {Component, HostListener, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

   title: string;

   message: string;

   detailLines: string[];

   confirmButtonText: string;

   showCancelButton: boolean;

   constructor
      (
         public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
         @Inject(MAT_DIALOG_DATA) public data: any
      )
   {
      this.title = data.title;
      this.message = data.message;
      this.detailLines = data.detailLines || [];
      this.confirmButtonText = data.confirmButtonText || 'OK';
      this.showCancelButton = data.showCancelButton != null ? data.showCancelButton : true;
   }


   @HostListener('window:keydown.ENTER')
   acceptAndClose()
   {
      this.dialogRef.close(true);
   }

}
