import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';

import {WrapupData} from '../../test-data';
import {EmployeeTimestamp} from '../../../../../shared/client-models/employee-timestamp';
import {AppUser, FactsUserTimeCharge, SampleOp, UserReference} from '../../../../../../generated/dto';
import {GeneralFactsService} from '../../../../../shared/services/general-facts.service';
import {TimeChargesComponent} from '../../../../../common-components/time-charges/time-charges.component';
import {analystTypeCode, leadIndicator} from '../../../../../shared/client-models/time-charges';
import {AlertMessageService} from '../../../../../shared/services/alerts';

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

   @Input()
   appUser: AppUser;

   @Output()
   testDataSaveRequest = new EventEmitter<void>();

   usersByShortName: Map<string, UserReference>;

   destinationsEnabled = false;
   otherDescriptionEnabled = false;

   unsavedTimeCharges = false;

   @ViewChild(TimeChargesComponent) timeChargesComp: TimeChargesComponent;

   constructor
      (
         private generalFactsService: GeneralFactsService,
         private alertMsgSvc: AlertMessageService
      )
   {}

   ngOnChanges()
   {
      this.unsavedTimeCharges =
         unsavedEditsExist(this.getTimeChargesLastEdited(), this.getTimeChargesLastSavedToFacts());

      this.usersByShortName = makeUserRefsByUserShortNameMap(this.labGroupUsers);

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
      this.setTimeChargesLastEdited(moment());
   }

   saveTimeChargesToFacts()
   {
      const saveStarted = moment();

      const userTimeCharges = this.timeChargesComp.getUserTimeCharges();

      const factsUserTimeCharges: FactsUserTimeCharge[] =
         userTimeCharges.map(appUserTimeCharge => {
            const tc = appUserTimeCharge.timeCharge;
            const personId: number = this.usersByShortName.get(appUserTimeCharge.userShortName).factsPersonId;
            return {
               assignedToPersonId: personId,
               analystTypeCode: analystTypeCode(tc.role),
               leadIndicator: leadIndicator(tc.role),
               remarks: '',
               statusCode: tc.assignmentStatus,
               hoursSpentNum: tc.hours,
               hoursCreditedOrgName: this.labGroupParentOrgName
            };
         });

      this.generalFactsService.submitTimeCharges(this.sampleOp.opId, factsUserTimeCharges).subscribe(
         () => {
            this.setTimeChargesLastSavedToFacts(saveStarted);

            this.generalFactsService.setSampleOperationWorkStatus(this.sampleOp.opId, 'O', this.appUser.factsPersonId)
            .subscribe(
               () => { console.log('FACTS status updated to original-complete after saving work hours.'); },
               err => this.onFactsStatusUpdateError(err)
            );

            // TODO: Emit new event requesting to save the test data.
         },
         err => {
            console.error('Error trying to save work accomplishments to FACTS: ', err);
            this.alertMsgSvc.alertDanger('Failed to save accomplishment hours to FACTS.');
         }
      );
   }

   private getTimeChargesLastEdited(): Moment | null
   {
      const isoTimestamp = this.form.get('timeChargesLastEdited').value;

      return isoTimestamp ? moment(isoTimestamp) : null;
   }

   private setTimeChargesLastEdited(instant: Moment)
   {
      this.form.get('timeChargesLastEdited').setValue(instant.toISOString());

      this.unsavedTimeCharges =
         unsavedEditsExist(this.getTimeChargesLastEdited(), this.getTimeChargesLastSavedToFacts());
   }

   private getTimeChargesLastSavedToFacts(): Moment | null
   {
      const isoTimestamp = this.form.get('timeChargesLastSavedToFacts').value;

      return isoTimestamp ? moment(isoTimestamp) : null;
   }

   private setTimeChargesLastSavedToFacts(instant: Moment)
   {
      this.form.get('timeChargesLastSavedToFacts').setValue(instant.toISOString());

      this.unsavedTimeCharges =
         unsavedEditsExist(this.getTimeChargesLastEdited(), this.getTimeChargesLastSavedToFacts());
   }

   private onFactsStatusUpdateError(err)
   {
      console.log('Error occurred while trying to set FACTS status to original-complete, details below:');
      console.log(err);

      this.alertMsgSvc.alertDanger(
         'An error occurred while trying to set FACTS status to original-complete. ' +
         'The status update may not have been received properly by FACTS.'
      );
   }


}

function unsavedEditsExist(lastEdited: Moment | null, lastSaved: Moment | null): boolean
{
   return lastEdited && (!lastSaved || lastEdited.isAfter(lastSaved));
}


function makeUserRefsByUserShortNameMap(labUsers: UserReference[]): Map<string, UserReference>
{
   const m = new Map<string, UserReference>();

   for ( const userRef of labUsers )
   {
      m.set(userRef.shortName, userRef);
   }

   return m;
}
