import {Component, Input, OnChanges} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

import {
   makeEmptyIsolateTestSequence, makePositiveTestUnitContinuationTestsFormGroup,
   PositiveContinuationData,
   PositiveTestUnitContinuationTests,
   SelectiveAgarsTestSuite,
} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

@Component({
   selector: 'app-stage-pos-cont',
   templateUrl: './stage-pos-cont.component.html',
   styleUrls: ['./stage-pos-cont.component.scss']
})
export class StagePosContComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   vidasPositiveSampleTestUnitNumbers: number[] | null = null;

   @Input()
   conflicts: PositiveContinuationData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   testsFormArray: FormArray;

   readonly defaultNumIsolatesPerSelectiveAgarPlate = 2;


   constructor() { }

   ngOnChanges()
   {
      this.testsFormArray = this.form.controls['positiveTestUnitContinuationTestss'] as FormArray;
   }

   addPositiveTestUnitContinuationTestsFormGroup()
   {
      const newContTests: PositiveTestUnitContinuationTests = this.makePositiveTestUnitContinuationTests();

      const newFormGroup = makePositiveTestUnitContinuationTestsFormGroup(newContTests);

      this.testsFormArray.push(newFormGroup);
   }


   addIsolateTestSequenceFormGroup(toFormArray: FormArray)
   {
      // TODO
   }

   // TODO: Modify the below for data structure changes in test_data.ts.
   private makePositiveTestUnitContinuationTests(): PositiveTestUnitContinuationTests
   {
      return {
         positiveTestUnitNumber: null,
         rvSourcedTests: this.makeSelectiveAgarTestSuite(),
         ttSourcedTests: this.makeSelectiveAgarTestSuite()
      };
   }

   private makeSelectiveAgarTestSuite(): SelectiveAgarsTestSuite
   {
      return ({
         he: this.makeSelectiveAgarTests(),
         xld: this.makeSelectiveAgarTests(),
         bs_24h: this.makeSelectiveAgarTests(),
         bs_48h: this.makeSelectiveAgarTests(),
      });
   }

   private makeSelectiveAgarTests(): SelectiveAgarTests
   {
      const numIsolates = this.defaultNumIsolatesPerSelectiveAgarPlate;
      return ({
         colonyAppearance: null,
         isolateTests: Array.from(Array(numIsolates), () => makeEmptyIsolateTestSequence())
      });
   }
}


