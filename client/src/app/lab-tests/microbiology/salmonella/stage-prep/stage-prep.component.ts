import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';

import {PrepData} from '../test-data';
import {GeneralFactsService} from '../../../../shared/services/general-facts.service';
import {AlertMessageService} from '../../../../shared/services/alerts';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {AppUser, SampleOp, SampleTransfer} from '../../../../../generated/dto';
import {ItemsSelectionDialogComponent} from '../../../../common-components/items-selection-dialog/items-selection-dialog.component';

@Component({
   selector: 'app-stage-prep',
   templateUrl: './stage-prep.component.html',
   styleUrls: ['./stage-prep.component.scss'],
})
export class StagePrepComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: PrepData;

   @Input()
   sampleOp: SampleOp;

   @Input()
   currentUser: AppUser;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   constructor
      (
         private generalFactsService: GeneralFactsService,
         private dialogSvc: MatDialog,
         private alertMsgSvc: AlertMessageService,
      )
   {}

   ngOnChanges() {}

   promptGetReceivedFieldsFromFacts(receivingPersonId: number|null)
   {
      this.generalFactsService.getSampleTransfers(this.sampleOp.sampleTrackingNum, receivingPersonId).subscribe(
         sampleTransfers => {
            switch ( sampleTransfers.length )
            {
               case 0:
                  this.alertMsgSvc.alertInfo(
                     'No FACTS transfers found for this sample' + (receivingPersonId ? ' for the current user.' : '.')
                  );
                  break;
               case 1:
                  this.fillReceivedFields(sampleTransfers[0]);
                  break;
               default:
                  this.promptSelectSampleTransfer(sampleTransfers).subscribe(selectedSampleTransfers => {
                     if ( selectedSampleTransfers )
                        this.fillReceivedFields(selectedSampleTransfers[0]);
                  });
            }
         },
         err => this.alertMsgSvc.alertDanger('Failed to load samples ' + (err.message ? ': ' + err.message + '.' : '.'))
      );
   }

   promptSelectSampleTransfer(sampleTransferChoices: SampleTransfer[]): Observable<SampleTransfer|undefined>
   {
      const dlg = this.dialogSvc.open(ItemsSelectionDialogComponent, {
         width: 'calc(75%)',
         data: {
            title: 'Select a Sample Transfer',
            message: 'Select one sample transfer below from which to fill received fields.',
            choiceItems: sampleTransferChoices,
            itemText: (st: SampleTransfer) => `from ${st.sentByPersonFirstName} ${st.sentByPersonLastName} to ` +
               `${st.receivedByPersonFirstName} ${st.receivedByPersonLastName} (${st.receivedDate})`,
            minSelectionCount: 1,
            maxSelectionCount: 1
         }
      });

      return dlg.afterClosed();
   }

   fillReceivedFields(transfer: SampleTransfer)
   {
      const receivedFrom =
         ((transfer.sentByPersonFirstName || '') + ' ' + (transfer.sentByPersonLastName || '')).trim() +
         (transfer.sentByPersonId ? ' [' + transfer.sentByPersonId + ']' : '');
      this.form.get('sampleReceivedFrom').setValue(receivedFrom);

      this.form.get('sampleReceivedDate').setValue(transfer.receivedDate || '');
   }
}
