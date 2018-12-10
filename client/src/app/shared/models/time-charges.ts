import {FormControl, FormGroup} from '@angular/forms';

export interface TimeCharge {

   role: ChargeRole;

   hours: number;

   enteredTimestamp: string;

}

export interface TestTimeCharges {

   [userShortName: string]: TimeCharge;

}

export type ChargeRole = 'lead' | 'check' | 'additional';


export function makeTestTimeChargesFormGroup(testTimeCharges: TestTimeCharges | null): FormGroup
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
      hours: new FormControl(timeCharge.hours),
      enteredTimestamp: new FormControl(timeCharge.enteredTimestamp),
   });
}

