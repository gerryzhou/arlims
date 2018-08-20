import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {TestStageStatus} from '../../lab-tests/test-stages';
import {DatePipe} from '@angular/common';

@Component({
   selector: 'app-test-stage-status',
   templateUrl: './test-stage-status.component.html',
   styleUrls: ['./test-stage-status.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestStageStatusComponent implements OnChanges {

   @Output()
   click = new EventEmitter<null>();

   @Input()
   status: TestStageStatus;

   fieldValuesStatusText: string;

   constructor(private datePipe: DatePipe) { }

   ngOnChanges() {
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
