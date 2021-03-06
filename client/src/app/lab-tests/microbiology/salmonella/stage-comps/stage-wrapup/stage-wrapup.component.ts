import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import * as moment from 'moment';
import {Moment} from 'moment';

import {AnalystTypeCode, AppUser, FactsUserTimeCharge, SampleOp, UserReference, YesNoCode} from '../../../../../../generated/dto';
import {GeneralFactsService} from '../../../../../shared/services/general-facts.service';
import {TimeChargesComponent} from '../../../../../common-components/time-charges/time-charges.component';
import {AlertMessageService} from '../../../../../shared/services/alerts';
import {TimeChargeRole} from '../../test-data';

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
   showUnsetAffordances = false;

   @Input()
   sampleOp: SampleOp;

   @Input()
   labGroupUsers: UserReference[];

   @Input()
   appUser: AppUser;

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
      this.unsavedTimeCharges = this.checkFormForUnsavedTimeCharges();

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
      const now = moment();
      this.setTimeChargesLastEdited(now);
   }

   saveTimeChargesToFacts(): Observable<void>
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
               hoursSpentNumber: tc.hours,
               hoursCreditedOrgName: this.appUser.factsOrgName
            };
         });

      return (
         this.generalFactsService.submitTimeCharges(this.sampleOp.opId, factsUserTimeCharges)
         .pipe(
            tap(() => {
               this.setTimeChargesLastSavedToFacts(saveStarted);
            })
         )
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

      this.unsavedTimeCharges = this.checkFormForUnsavedTimeCharges();
   }

   private getTimeChargesLastSavedToFacts(): Moment | null
   {
      const isoTimestamp = this.form.get('timeChargesLastSavedToFacts').value;

      return isoTimestamp ? moment(isoTimestamp) : null;
   }

   private setTimeChargesLastSavedToFacts(instant: Moment)
   {
      this.form.get('timeChargesLastSavedToFacts').setValue(instant.toISOString());

      this.unsavedTimeCharges = this.checkFormForUnsavedTimeCharges();
   }

   checkFormForUnsavedTimeCharges(): boolean
   {
      return unsavedEditsExist(
         this.getTimeChargesLastEdited(),
         this.getTimeChargesLastSavedToFacts()
      );
   }
}

function unsavedEditsExist
   (
      lastEdited: Moment | null,
      lastSaved: Moment | null
   )
   : boolean
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

function analystTypeCode(chargeRole: TimeChargeRole): AnalystTypeCode
{
   switch (chargeRole) {
      case 'lead':
         return 'O';
      case 'additional':
         return 'A';
      case 'check':
         return 'C';
   }
}

function leadIndicator(chargeRole: TimeChargeRole): YesNoCode
{
   return chargeRole === 'lead' ? 'Y' : 'N';
}
