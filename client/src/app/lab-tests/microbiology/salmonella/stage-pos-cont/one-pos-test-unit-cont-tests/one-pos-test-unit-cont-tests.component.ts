import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-one-pos-test-unit-cont-tests',
   templateUrl: './one-pos-test-unit-cont-tests.component.html',
   styleUrls: ['./one-pos-test-unit-cont-tests.component.scss']
})
export class OnePosTestUnitContTestsComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   testUnitNumber: number;

   @Input()
   sampleTestUnitsTypeAbrev: string;

   @Input()
   showDisposeButton = false;

   @Output()
   disposeRequested = new EventEmitter<void>();

   constructor() { }

   ngOnChanges()
   {
   }

   onDisposeRequested()
   {
      this.disposeRequested.emit();
   }
}
