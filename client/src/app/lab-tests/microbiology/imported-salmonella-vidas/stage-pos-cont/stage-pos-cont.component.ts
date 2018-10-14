import {Component, Input, OnChanges} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

import {
   makeEmptyIsolateTestSequence,
   makeEmptyPositivesContinuationControls,
   makePositivesContinuationControlsFormGroup,
   makePositiveTestUnitContinuationTestsFormGroup,
   PositivesContinuationData,
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
   conflicts: PositivesContinuationData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   testsFormArray: FormArray;
   controlsFormGroupInitialized: boolean;

   readonly defaultNumIsolatesPerSelectiveAgarPlate = 2;


   constructor() { }

   ngOnChanges()
   {
      this.testsFormArray = this.form.controls['positiveTestUnitContinuationTestss'] as FormArray;
      this.controlsFormGroupInitialized = this.form.controls['controls'] != null;
   }

   initPositivesContinuationControlsFormGroup()
   {
      if ( !this.controlsFormGroupInitialized )
      {
         const posContControls = makeEmptyPositivesContinuationControls();
         const posContConstrolsFormGroup = makePositivesContinuationControlsFormGroup(posContControls);
         this.form.addControl('controls', posContConstrolsFormGroup);
         this.controlsFormGroupInitialized = true;
      }
      else
         console.log('Ignoring attempt to add positives continuation controls form group when this form group is already present.');
   }

   addPositiveTestUnitContinuationTestsFormGroup()
   {
      const newContTests: PositiveTestUnitContinuationTests = this.makeOnePositiveTestUnitContinuationTests();

      this.testsFormArray.push(makePositiveTestUnitContinuationTestsFormGroup(newContTests));
   }


   private makeOnePositiveTestUnitContinuationTests(testUnitNum: number | null = null): PositiveTestUnitContinuationTests
   {
      return {
         positiveTestUnitNumber: testUnitNum,
         rvSourcedTests: this.makeSelectiveAgarTestSuite(),
         ttSourcedTests: this.makeSelectiveAgarTestSuite()
      };
   }

   private makeSelectiveAgarTestSuite(): SelectiveAgarsTestSuite
   {
      const numIsolates = this.defaultNumIsolatesPerSelectiveAgarPlate;
      return {
         he: Array.from(Array(numIsolates), () => makeEmptyIsolateTestSequence()),
         xld: Array.from(Array(numIsolates), () => makeEmptyIsolateTestSequence()),
         bs24h: Array.from(Array(numIsolates), () => makeEmptyIsolateTestSequence()),
         bs48h: Array.from(Array(numIsolates), () => makeEmptyIsolateTestSequence()),
      };
   }
}


