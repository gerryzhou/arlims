import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, from as obsFrom} from 'rxjs';

import {WrapupData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {UserReference} from '../../../../../generated/dto';
import {UserContextService} from '../../../../shared/services';

@Component({
   selector: 'app-stage-wrapup',
   templateUrl: './stage-wrapup.component.html',
   styleUrls: ['./stage-wrapup.component.scss'],
})
export class StageWrapupComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   allowDataChanges: boolean;

   @Input()
   conflicts: WrapupData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   destinationsEnabled = false;
   otherDescriptionEnabled = false;

   labGroupUsers$: Observable<UserReference[]>;

   constructor
       (
          private userCtxSvc: UserContextService,
       )
   {
      this.labGroupUsers$ = obsFrom(
         userCtxSvc.getLabGroupContents()
         .then(lgc => lgc.memberUsers)
      );
   }

   updateControlEnablements()
   {
      const reserveSampleDispositionCtrl = this.form.get('reserveSampleDisposition');
      if (reserveSampleDispositionCtrl)
      {
         this.destinationsEnabled = reserveSampleDispositionCtrl.value === 'ISOLATES_SENT';
         this.otherDescriptionEnabled = reserveSampleDispositionCtrl.value === 'OTHER';

         if ( this.destinationsEnabled && !this.form.disabled ) this.form.get('reserveSampleDestinations').enable();
         else this.form.get('reserveSampleDestinations').disable();

         if ( this.otherDescriptionEnabled && !this.form.disabled ) this.form.get('reserveSampleOtherDescription').enable();
         else this.form.get('reserveSampleOtherDescription').disable();
      }
   }

   ngOnChanges()
   {
      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();

      if ( this.allowDataChanges )
         this.updateControlEnablements();
   }

   onReserveSampleDispositionChanged()
   {
      this.updateControlEnablements();
   }
}
