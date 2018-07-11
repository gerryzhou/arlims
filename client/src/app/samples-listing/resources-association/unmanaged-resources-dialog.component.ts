import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef} from '@angular/material';
import {SamplesResourcesAssociation} from './samples-resources-association';
import {COMMA, ENTER, SPACE, TAB} from '@angular/cdk/keycodes';
import {Sample} from '../../../generated/dto';

@Component({
   selector: 'app-samples-listing-unmanaged-resources-dialog',
   templateUrl: './unmanaged-resources-dialog.component.html',
   styleUrls: ['./unmanaged-resources-dialog.component.scss']
})
export class UnmanagedResourcesDialogComponent {

   readonly separatorKeysCodes: number[] = [ENTER];

   constructor(
      public dialogRef: MatDialogRef<UnmanagedResourcesDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SamplesResourcesAssociation
   ) {}

   removeSample(sample: Sample) {
      this.data.samples = this.data.samples.filter(s => s.id !== sample.id);
   }

   addResourceCodes(event: MatChipInputEvent) {
      if (event.value) {
         const toks = event.value.split(/\s+/);
         for (const tok of toks) {
            if (tok.length > 0) {
               this.data.resourceCodes.push(tok);
            }
         }
      }
      if (event.input) { event.input.value = ''; }
   }

   removeResourceCode(code: string) {
      this.data.resourceCodes = this.data.resourceCodes.filter(rc => rc !== code);
   }

   onNoClick(): void {
      this.dialogRef.close();
   }

}

