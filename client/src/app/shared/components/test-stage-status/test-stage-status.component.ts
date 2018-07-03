import {Component, Input, OnInit} from '@angular/core';
import {TestStageStatus} from '../../../lab-tests/test-stage-status';

@Component({
  selector: 'app-test-stage-status',
  templateUrl: './test-stage-status.component.html',
  styleUrls: ['./test-stage-status.component.scss']
})
export class TestStageStatusComponent implements OnInit {

   @Input()
   status: TestStageStatus;

   fieldValuesStatusText: string;

   constructor() { }

   ngOnInit() {
      switch ( this.status.fieldValuesStatus ) {
         case 'e': this.fieldValuesStatusText = 'empty'; break;
         case 'i': this.fieldValuesStatusText = 'incomplete'; break;
         case 'c': this.fieldValuesStatusText = 'complete'; break;
         default: this.fieldValuesStatusText = '?';
      }
   }

}
