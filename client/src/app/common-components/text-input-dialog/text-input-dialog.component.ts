import {Component, HostListener, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.scss']
})
export class TextInputDialogComponent {

   title: string;
   message: string;
   input: string = null;
   acceptRegex: RegExp | null;

   constructor
      (
         public dialogRef: MatDialogRef<TextInputDialogComponent, string>,
         @Inject(MAT_DIALOG_DATA) public data: any
      )
   {
      this.title = data.title;
      this.message = data.message;
      this.acceptRegex = data.acceptRegex ? new RegExp(data.acceptRegex) : null;
   }


   @HostListener('window:keydown.ENTER')
   acceptAndClose()
   {
      if ( this.input == null || this.input.trim().length === 0 ||
           this.acceptRegex && !this.acceptRegex.test(this.input) )
         return;

      const res = !this.acceptRegex || this.acceptRegex.test(this.input) ? this.input.trim() : null;
      this.dialogRef.close(res);
   }

}
