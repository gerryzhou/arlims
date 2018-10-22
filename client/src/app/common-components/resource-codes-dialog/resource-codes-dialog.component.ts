import {Component, HostListener} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ResourceCodesDialogResult} from './resource-codes-dialog-result';


@Component({
  selector: 'app-resource-codes-dialog',
  templateUrl: './resource-codes-dialog.component.html',
  styleUrls: ['./resource-codes-dialog.component.scss']
})
export class ResourceCodesDialogComponent {

   data: ResourceCodesDialogResult;

   constructor(public dialogRef: MatDialogRef<ResourceCodesDialogComponent>)
   {
      this.data = { resourceCodes: [] };
   }

   addResourceCodesForInput(event: any)
   {
      const value = event.target ? event.target.value : undefined;
      const input = event.target ? event.target : undefined;
      if (value && value.length > 2) { // assume pastes are at least 3 chars
         const toks = value.split(/\s+/);
         for (const tok of toks) {
            if (tok.length > 0) {
               this.data.resourceCodes.push(tok);
            }
         }
      }
      if (input) { input.value = ''; }
   }

   addResourceCodes(event: any) {
      const value = event.value;
      const input = event.input;
      if (value) {
         const toks = value.split(/\s+/);
         for (const tok of toks) {
            if (tok.length > 0) {
               this.data.resourceCodes.push(tok);
            }
         }
      }
      if (input) { input.value = ''; }
   }

   removeResourceCodeAt(i: number)
   {
      this.data.resourceCodes = this.data.resourceCodes.filter((v, ix) => ix !== i);
   }

   onNoClick(): void
   {
      this.dialogRef.close();
   }

   @HostListener('window:keydown.ENTER')
   acceptAndCloseIfValid()
   {
      if ( this.data.resourceCodes.length === 0 )
         return;
      this.dialogRef.close(this.data);
   }
}
