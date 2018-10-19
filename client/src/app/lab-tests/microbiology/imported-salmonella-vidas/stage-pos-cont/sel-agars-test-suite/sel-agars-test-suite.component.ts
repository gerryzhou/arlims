import {Component, Input, OnChanges} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
   selector: 'app-sel-agars-test-suite',
   templateUrl: './sel-agars-test-suite.component.html',
   styleUrls: ['./sel-agars-test-suite.component.scss']
})
export class SelAgarsTestSuiteComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   selAgars: SelectiveAgar[] = [
      { formGroupName: 'he', displayName: 'HE'},
      { formGroupName: 'xld', displayName: 'XLD'},
      { formGroupName: 'bs24h', displayName: 'BS 24h'},
      { formGroupName: 'bs48h', displayName: 'BS 48h'},
   ];

   constructor() { }

   ngOnChanges()
   {
   }

   removeIsolateTestSeqAtIndex(selAgar: string, i: number)
   {
      const isolatesFormArray = this.form.get(selAgar) as FormArray;
      isolatesFormArray.removeAt(i);
   }
}

interface SelectiveAgar {
   formGroupName: string;
   displayName: string;
}
