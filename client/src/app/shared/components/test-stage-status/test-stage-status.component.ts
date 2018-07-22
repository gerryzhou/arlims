import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestStageStatus} from '../../../lab-tests/test-stages';
import {DatePipe} from '@angular/common';
import {parseISOTimestampLocal} from '../../util/dates-and-times';
import {LabTestMetadata} from '../../../../generated/dto';

@Component({
  selector: 'app-test-stage-status',
  templateUrl: './test-stage-status.component.html',
  styleUrls: ['./test-stage-status.component.scss']
})
export class TestStageStatusComponent implements OnInit {

   @Output()
   click = new EventEmitter<null>();

   @Input()
   status: TestStageStatus;

   fieldValuesStatusText: string;

   constructor(private datePipe: DatePipe) { }

   ngOnInit() {
      switch ( this.status.fieldValuesStatus ) {
         case 'e': this.fieldValuesStatusText = 'empty'; break;
         case 'i': this.fieldValuesStatusText = 'incomplete'; break;
         case 'c': this.fieldValuesStatusText = 'complete'; break;
         default: this.fieldValuesStatusText = '?';
      }
   }

   onClicked() {
      this.click.next(null);
   }
}
