import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-one-pos-test-unit-cont-tests',
   templateUrl: './one-pos-test-unit-cont-tests.component.html',
   styleUrls: ['./one-pos-test-unit-cont-tests.component.scss']
})
export class OnePosTestUnitContTestsComponent implements OnChanges {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnChanges()
   {
   }

}
