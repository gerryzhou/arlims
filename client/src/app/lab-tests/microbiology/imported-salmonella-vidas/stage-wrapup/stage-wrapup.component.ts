import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {WrapupData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

@Component({
  selector: 'app-stage-wrapup',
  templateUrl: './stage-wrapup.component.html',
  styleUrls: ['./stage-wrapup.component.scss']
})
export class StageWrapupComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: WrapupData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   destinationsEnabled = false;
   otherDescriptionEnabled = false;

   constructor() { }

   updateControlEnablements() {
      const reserveSampleDispositionCtrl = this.form.get('reserveSampleDisposition');
      if (reserveSampleDispositionCtrl) {
         this.destinationsEnabled = reserveSampleDispositionCtrl.value === 'ISOLATES_SENT';
         this.otherDescriptionEnabled = reserveSampleDispositionCtrl.value === 'OTHER';

         if (this.destinationsEnabled) this.form.get('reserveSampleDestinations').enable();
         else this.form.get('reserveSampleDestinations').disable();

         if (this.otherDescriptionEnabled) this.form.get('reserveSampleOtherDescription').enable();
         else this.form.get('reserveSampleOtherDescription').disable();
      }
   }

   ngOnChanges() {
      this.updateControlEnablements();
   }

   onReserveSampleDispositionChanged() {
      this.updateControlEnablements();
   }
}
