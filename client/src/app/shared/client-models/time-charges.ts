import {FormControl, FormGroup} from '@angular/forms';
import {AnalystTypeCode, TimeChargeStatusCode, YesNoCode} from '../../../generated/dto';

export interface TimeCharge {

   role: ChargeRole;

   hours: number;

   assignmentStatus: TimeChargeStatusCode;

   enteredTimestamp: string;

}

export interface TimeChargesSet {

   [userShortName: string]: TimeCharge;

}

export type ChargeRole = 'lead' | 'additional' | 'check'; // display text for analyst type codes

export function analystTypeCode(chargeRole: ChargeRole): AnalystTypeCode
{
   switch ( chargeRole )
   {
      case 'lead': return 'O';
      case 'additional': return 'A';
      case 'check': return 'C';
   }
}

export function leadIndicator(chargeRole: ChargeRole): YesNoCode
{
   return chargeRole === 'lead' ? 'Y' : 'N';
}



export function makeTimeChargesSetFormGroup(testTimeCharges: TimeChargesSet | null): FormGroup
{
   const fgControls: { [userShortName: string]: FormGroup } = {};

   if ( testTimeCharges )
   {
      for ( const userShortName of Object.keys(testTimeCharges) )
         fgControls[userShortName] = makeTimeChargeFormGroup(testTimeCharges[userShortName]);
   }

   return new FormGroup(fgControls);
}

export function makeTimeChargeFormGroup(timeCharge: TimeCharge): FormGroup
{
   return new FormGroup({
      role: new FormControl(timeCharge.role),
      assignmentStatus: new FormControl(timeCharge.assignmentStatus),
      hours: new FormControl(timeCharge.hours),
      enteredTimestamp: new FormControl(timeCharge.enteredTimestamp),
   });
}
