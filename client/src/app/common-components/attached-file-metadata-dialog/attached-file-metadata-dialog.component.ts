import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AttachedFileMetadataDialogData} from './attached-file-metadata-dialog-data';

@Component({
   selector: 'app-attached-file-metadata-dialog',
   templateUrl: './attached-file-metadata-dialog.component.html',
   styleUrls: ['./attached-file-metadata-dialog.component.scss']
})
export class AttachedFileMetadataDialogComponent {

   constructor(
      public dialogRef: MatDialogRef<AttachedFileMetadataDialogComponent, AttachedFileMetadataDialogData>,
      @Inject(MAT_DIALOG_DATA) public data: AttachedFileMetadataDialogData
   ) {}

   onNoClick(): void {
      this.dialogRef.close();
   }

   @HostListener('window:keydown.ENTER')
   acceptAndCloseIfValid()
   {
      if ( !this.data.fileName )
         return;
      this.dialogRef.close(this.data);
   }
}

