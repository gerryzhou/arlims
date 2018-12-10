import {Component, HostListener, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as moment from 'moment';

import {DialogData} from './dialog-data';
import {UserTimeCharge} from '../user-time-charge';

@Component({
   selector: 'app-user-time-charge-dialog',
   templateUrl: './user-time-charge-dialog.component.html',
   styleUrls: ['./user-time-charge-dialog.component.scss']
})
export class UserTimeChargeDialogComponent {

   userFieldEditable: boolean;

   constructor(
      public dialogRef: MatDialogRef<UserTimeChargeDialogComponent, UserTimeCharge>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
   )
   {
      if ( !this.data.userTimeCharge )
      {
         this.data.userTimeCharge = {
            userShortName: null,
            timeCharge: {
               role: null,
               hours: null,
               assignmentStatus: null,
               enteredTimestamp: null,
            }
         };
         this.userFieldEditable = true;
      }
      else
      {
         this.userFieldEditable = false;
      }
   }

   onNoClick(): void {
      this.dialogRef.close();
   }

   @HostListener('window:keydown.ENTER')
   acceptAndCloseIfValid()
   {
      if ( this.isDataValid() )
      {
         if ( this.data.userTimeCharge.timeCharge.enteredTimestamp == null )
            this.data.userTimeCharge.timeCharge.enteredTimestamp = moment().toISOString();
         this.dialogRef.close(this.data.userTimeCharge);
      }
   }

   isDataValid(): boolean
   {
      return (
         this.data &&
         this.data.userTimeCharge &&
         this.data.userTimeCharge.userShortName &&
         this.data.userTimeCharge.timeCharge &&
         this.data.userTimeCharge.timeCharge.role &&
         this.data.userTimeCharge.timeCharge.assignmentStatus &&
         this.data.userTimeCharge.timeCharge.hours != null
      );
   }
}

