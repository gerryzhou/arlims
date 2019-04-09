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

   statusText: string;

   constructor(private datePipe: DatePipe) { }

   ngOnChanges() {
      switch ( this.status.stageStatus ) {
         case 'e': this.statusText = 'empty'; break;
         case 'i': this.statusText = 'incomplete'; break;
         case 'c': this.statusText = 'complete'; break;
         case 'n': this.statusText = 'not-applicable'; break;
         default: this.statusText = '?';
      }
   }

   onClicked() {
      this.click.next(null);
   }
}
