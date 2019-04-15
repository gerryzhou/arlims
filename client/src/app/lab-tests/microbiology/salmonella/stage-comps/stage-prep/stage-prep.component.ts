import {Component, Input, OnChanges} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import * as moment from 'moment';

import {GeneralFactsService} from '../../../../../shared/services/general-facts.service';
import {AlertMessageService} from '../../../../../shared/services/alerts';
import {AppUser, SampleOp, SampleTransfer} from '../../../../../../generated/dto';
import {ItemsSelectionDialogComponent} from '../../../../../common-components/items-selection-dialog/items-selection-dialog.component';

@Component({
   selector: 'app-stage-prep',
   templateUrl: './stage-prep.component.html',
   styleUrls: ['./stage-prep.component.scss'],
})
export class StagePrepComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   allowDataChanges: boolean;

   @Input()
   showUnsetAffordances = false;

   @Input()
   sampleOp: SampleOp;

   @Input()
   appUser: AppUser;

   sampleReceivedDateEnteredControl: AbstractControl;

   constructor
      (
         private generalFactsService: GeneralFactsService,
         private dialogSvc: MatDialog,
         private alertMsgSvc: AlertMessageService,
      )
   {}

   ngOnChanges()
   {
      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();

      this.sampleReceivedDateEnteredControl = this.form.get('sampleReceivedDateEntered');
   }

   promptGetReceivedFieldsFromFacts()
   {
      this.generalFactsService.getSampleTransfers(this.sampleOp.sampleTrackingNumber, null).subscribe(
         sampleTransfers => {
            switch ( sampleTransfers.length )
            {
               case 0:
                  this.alertMsgSvc.alertInfo('No FACTS transfers found for this sample.');
                  break;
               case 1:
                  this.fillReceivedFields(sampleTransfers[0]);
                  break;
               default:
                  this.promptSelectSampleTransfer(sampleTransfers).subscribe(selectedTransfers => {
                     if ( selectedTransfers )
                        this.fillReceivedFields(selectedTransfers[0]);
                  });
            }
         },
         err => this.alertMsgSvc.alertDanger('Failed to load samples ' + (err.message ? ': ' + err.message + '.' : '.'))
      );
   }

   promptSelectSampleTransfer(sampleTransfers: SampleTransfer[]): Observable<SampleTransfer|undefined>
   {
      function compare(s1: string, s2: string): number {
         if (!s1) return s2 ? -1 : 0;
         if (!s2) return 1;
         else return s1.localeCompare(s2);
      }

      const dateSortedTransfers = sampleTransfers.sort((a, b) => compare(b.receivedDate, a.receivedDate));
      const userFactsId = this.appUser.factsPersonId;
      const transferChoices =
         dateSortedTransfers
         .filter(t => t.receivedByPersonId === userFactsId)
         .concat(dateSortedTransfers.filter(t => t.receivedByPersonId !== userFactsId));

      const dlg = this.dialogSvc.open(ItemsSelectionDialogComponent, {
         width: 'calc(75%)',
         data: {
            title: 'Select a Sample Transfer',
            message: 'Select one sample transfer below from which to fill received fields.',
            choiceItems: transferChoices,
            itemText: st => this.sampleTransferDescription(st),
            minSelectionCount: 1,
            maxSelectionCount: 1
         }
      });

      return dlg.afterClosed();
   }

   fillReceivedFields(transfer: SampleTransfer)
   {
      const receivedFrom =
         ((transfer.sentByPersonFirstName || '') + ' ' + (transfer.sentByPersonLastName || '')).trim();
      this.form.get('sampleReceivedFrom').setValue(receivedFrom);

      this.form.get('sampleReceivedDate').setValue(transfer.receivedDate || '');

      this.onSampleReceivedDateChanged();
   }

   private sampleTransferDescription(st: SampleTransfer): string
   {
      const fromDescr =
         st.sentByPersonFirstName != null || st.sentByPersonLastName != null ?
            `${st.sentByPersonFirstName || ''} ${st.sentByPersonLastName || ''}`.trim()
            : st.sentByPersonId != null ? `person id ${st.sentByPersonId}` : '<N/A>';
      const toDescr =
         st.receivedByPersonFirstName != null || st.receivedByPersonLastName != null ?
            `${st.receivedByPersonFirstName || ''} ${st.receivedByPersonLastName || ''}`.trim()
            : st.receivedByPersonId != null ? `person id ${st.receivedByPersonId}` : '<N/A>';

      return `from ${fromDescr} to ${toDescr} (${st.receivedDate})`;
   }

   onSampleReceivedDateChanged()
   {
      if  ( this.form.get('sampleReceivedDate').value &&
            this.sampleReceivedDateEnteredControl.value == null )
      {
         this.sampleReceivedDateEnteredControl.setValue(moment().format());
      }
   }
}
