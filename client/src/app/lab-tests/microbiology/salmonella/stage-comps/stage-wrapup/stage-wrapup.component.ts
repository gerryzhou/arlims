import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';

import {WrapupData} from '../../test-data';
import {EmployeeTimestamp} from '../../../../../shared/models/employee-timestamp';
import {SampleOp, UserReference} from '../../../../../../generated/dto';
import {GeneralFactsService} from '../../../../../shared/services/general-facts.service';
import {TimeChargesComponent} from '../../../../../common-components/time-charges/time-charges.component';

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

   @Input()
   sampleOp: SampleOp;

   @Input()
   labGroupParentOrgName: string;

   @Input()
   labGroupUsers: UserReference[];

   destinationsEnabled = false;
   otherDescriptionEnabled = false;

   unsavedTimeCharges = false;

   @ViewChild(TimeChargesComponent) timeChargesComp: TimeChargesComponent;

   constructor
      (
         private factsService: GeneralFactsService
      )
   {}

   ngOnChanges()
   {
      this.unsavedTimeCharges =
         unsavedEditsExist(this.getTimeChargesLastEdited(), this.getTimeChargesLastSavedToFacts());

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

   updateControlEnablements()
   {
      const reserveSampleDispositionCtrl = this.form.get('reserveSampleDisposition');

      if ( reserveSampleDispositionCtrl )
      {
         this.destinationsEnabled = reserveSampleDispositionCtrl.value === 'ISOLATES_SENT';
         this.otherDescriptionEnabled = reserveSampleDispositionCtrl.value === 'OTHER';

         if ( this.destinationsEnabled && !this.form.disabled ) this.form.get('reserveSampleDestinations').enable();
         else this.form.get('reserveSampleDestinations').disable();

         if ( this.otherDescriptionEnabled && !this.form.disabled ) this.form.get('reserveSampleOtherDescription').enable();
         else this.form.get('reserveSampleOtherDescription').disable();
      }
   }

   onTimeChargesDataChanged()
   {
      this.form.get('timeChargesLastEdited').setValue(moment().toISOString());

      this.unsavedTimeCharges = true;
   }

   saveTimeChargesToFacts()
   {
      const saveStarted = moment();

      const userTimeCharges = this.timeChargesComp.getUserTimeCharges();

      console.log('TODO: Save user time charges to FACTS: ', userTimeCharges);

      // TODO: Call new FACTS service method.
      // TODO: If save succeeded, update timeChargesLastSavedToFacts and then set unsavedTimeCharges as in ngOnChanges().
   }

   private getTimeChargesLastEdited(): Moment | null
   {
      const isoTimestamp = this.form.get('timeChargesLastEdited').value;

      if ( !isoTimestamp ) return null;
      else return moment(isoTimestamp);
   }

   private getTimeChargesLastSavedToFacts(): Moment | null
   {
      const isoTimestamp = this.form.get('timeChargesLastSavedToFacts').value;

      if ( !isoTimestamp ) return null;
      else return moment(isoTimestamp);
   }
}

function unsavedEditsExist(lastEdited: Moment | null, lastSaved: Moment | null)
{
   return lastEdited && (!lastSaved || lastEdited.isAfter(lastSaved));
}

