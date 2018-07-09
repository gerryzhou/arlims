import {Component, Input, OnInit} from '@angular/core';
import {TestStageStatus} from '../../../lab-tests/test-stage-status';
import {DatePipe} from '@angular/common';
import {parseISOTimestampLocal} from '../../util/dates-and-times';

@Component({
  selector: 'app-test-stage-status',
  templateUrl: './test-stage-status.component.html',
  styleUrls: ['./test-stage-status.component.scss']
})
export class TestStageStatusComponent implements OnInit {

   @Input()
   status: TestStageStatus;

   fieldValuesStatusText: string;

   signatureDescription: string | null;

   constructor(private datePipe: DatePipe) { }

   ngOnInit() {
      switch ( this.status.fieldValuesStatus ) {
         case 'e': this.fieldValuesStatusText = 'empty'; break;
         case 'i': this.fieldValuesStatusText = 'incomplete'; break;
         case 'c': this.fieldValuesStatusText = 'complete'; break;
         default: this.fieldValuesStatusText = '?';
      }

      if (!!this.status.signature ) {
         const sigTs = parseISOTimestampLocal(this.status.signature.signedInstant);
         this.signatureDescription =
            'signed by ' + this.status.signature.employeeShortName +
            ' on ' + this.datePipe.transform(sigTs, 'long');
      } else {
         this.signatureDescription = null;
      }
   }

}
