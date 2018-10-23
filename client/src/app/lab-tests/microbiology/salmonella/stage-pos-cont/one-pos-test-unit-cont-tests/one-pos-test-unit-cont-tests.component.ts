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
   sampleTestUnitsTypeAbrev: string;

   @Input()
   showDisposeButton = false;

   @Output()
   testUnitNumberChange = new EventEmitter<void>();

   @Output()
   disposeRequested = new EventEmitter<void>();

   testUnitNum: number | null = null;

   constructor() { }

   ngOnChanges()
   {
      this.testUnitNum = parseInt(this.form.get('testUnitNumber').value) || null;
   }

   onTestUnitNumberChanged()
   {
      this.testUnitNumberChange.emit();
      this.testUnitNum = parseInt(this.form.get('testUnitNumber').value) || null;
   }

   onDisposeRequested()
   {
      this.disposeRequested.emit();
   }
}
