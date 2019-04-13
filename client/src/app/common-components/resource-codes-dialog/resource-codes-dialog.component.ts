import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {ResourceCodesDialogResult} from './resource-codes-dialog-result';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-resource-codes-dialog',
  templateUrl: './resource-codes-dialog.component.html',
  styleUrls: ['./resource-codes-dialog.component.scss']
})
export class ResourceCodesDialogComponent implements OnInit {

   data: ResourceCodesDialogResult;

   inputFormControl: FormControl;

   constructor(public dialogRef: MatDialogRef<ResourceCodesDialogComponent>)
   {
      this.data = { resourceCodes: [] };
   }

   ngOnInit()
   {
      this.inputFormControl = new FormControl();
      this.inputFormControl.valueChanges
         .pipe( debounceTime(250) )
         .subscribe(codesStr => this.addResourceCodesForInput(codesStr));
   }

   addResourceCodesForInput(codesStr: string)
   {
      if ( codesStr && codesStr.length > 0 )
      {
         for ( const tok of codesStr.split(/\s+/) )
         {
            const trimmedTok = tok.trim();
            if ( trimmedTok.length > 0 )
               this.data.resourceCodes.push(trimmedTok);
         }

         this.inputFormControl.setValue('');
      }
   }

   onTokenEnd(event: any)
   {
      this.addResourceCodesForInput(event.value);
   }

   removeResourceCodeAt(i: number)
   {
      this.data.resourceCodes = this.data.resourceCodes.filter((v, ix) => ix !== i);
   }

   onNoClick(): void
   {
      this.dialogRef.close();
   }
}
