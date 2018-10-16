import {Component, Input, OnChanges} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

import {
   makeEmptyPositivesContinuationControls,
   makeEmptySelectiveAgarsTestSuite, makePositivesContinuationControlsFormGroup,
   makePositiveTestUnitContinuationTestsFormGroup, makePositiveTestUnitContinuationTestssFormArray,
   PositivesContinuationData,
   PositiveTestUnitContinuationTests,
} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {TestConfig} from '../test-config';

@Component({
   selector: 'app-stage-pos-cont',
   templateUrl: './stage-pos-cont.component.html',
   styleUrls: ['./stage-pos-cont.component.scss']
})
export class StagePosContComponent implements OnChanges {

   @Input()
   form: FormGroup; // May be empty of controls until user chooses to initiate positives continuation tests (if !formInitialized).

   @Input()
   vidasPositiveSampleTestUnitNumbers: number[] | null = null;

   @Input()
   testConfig: TestConfig | null;

   @Input()
   conflicts: PositivesContinuationData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   // Whether the controls for positives continuation tests have been created in the form yet.
   formInitialized = false;

   testsFormArray: FormArray | null = null;

   defaultNumIsolatesPerSelectiveAgarPlate = 2;


   constructor() { }

   ngOnChanges()
   {
      this.formInitialized = Object.keys(this.form.controls).length > 0;
      this.testsFormArray = this.formInitialized ? this.form.get('positiveTestUnitContinuationTestss') as FormArray : null;
      this.defaultNumIsolatesPerSelectiveAgarPlate =
         this.testConfig ? this.testConfig.positiveTestUnitsMinimumIsolatesPerSelectiveAgar || 2 : 2;
   }

   beginContinuationTests()
   {
      this.initFormGroup();
      this.addOnePositiveTestUnitContinuationTestsFormGroup();
   }

   beginContinuationTestsForVidasPositives()
   {
      this.initFormGroup();
      this.addMissingVidasPositivesContinuationTestsFormGroups();
   }

   private initFormGroup()
   {
      if ( !this.formInitialized )
      {
         const testUnitsFormArray = makePositiveTestUnitContinuationTestssFormArray([]);
         const controlsFormGroup = makePositivesContinuationControlsFormGroup(makeEmptyPositivesContinuationControls());

         this.form.addControl('positiveTestUnitContinuationTestss', testUnitsFormArray);
         this.form.addControl('controls', controlsFormGroup);

         this.formInitialized = true;
         this.testsFormArray = this.form.get('positiveTestUnitContinuationTestss') as FormArray;
      }
      else
         console.log('Ignoring attempt to add positives continuation controls form group when this form group is already present.');
   }

   addOnePositiveTestUnitContinuationTestsFormGroup(testUnitNum: number | null = null)
   {
      const newContTests: PositiveTestUnitContinuationTests = this.makeOnePositiveTestUnitContinuationTests(testUnitNum);

      this.testsFormArray.push(makePositiveTestUnitContinuationTestsFormGroup(newContTests));
   }


   addMissingVidasPositivesContinuationTestsFormGroups()
   {
      for ( const newTestUnitNum of this.getMissingVidasPositiveTestUnitNumbers() )
      {
         const testUnitContTests = this.makeOnePositiveTestUnitContinuationTests(newTestUnitNum);
         const testUnitContTestsFormGroup = makePositiveTestUnitContinuationTestsFormGroup(testUnitContTests);
         this.testsFormArray.push(testUnitContTestsFormGroup);
      }
   }

   getMissingVidasPositiveTestUnitNumbers(): number[]
   {
      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return [];

      const testUnitNums = new Set(this.vidasPositiveSampleTestUnitNumbers);

      for ( const repTestUnitNum of this.getRepresentedTestUnitNumbers() )
         testUnitNums.delete(repTestUnitNum);

      return Array.from(testUnitNums.values()).sort();
   }

   private getRepresentedTestUnitNumbers(): number[]
   {
      const testUnitNumbers = [];

      for ( const posTestUnitContTestsCtl of this.testsFormArray.controls )
      {
         const testUnitNumCtl = posTestUnitContTestsCtl.get('positiveTestUnitNumber');
         const testNum = testUnitNumCtl ? parseInt(testUnitNumCtl.value) : NaN;
         if ( testNum )
            testUnitNumbers.push(testNum);
      }

      return testUnitNumbers;
   }

   private makeOnePositiveTestUnitContinuationTests(testUnitNum: number | null = null): PositiveTestUnitContinuationTests
   {
      return {
         positiveTestUnitNumber: testUnitNum,
         rvSourcedTests: makeEmptySelectiveAgarsTestSuite(this.defaultNumIsolatesPerSelectiveAgarPlate),
         ttSourcedTests: makeEmptySelectiveAgarsTestSuite(this.defaultNumIsolatesPerSelectiveAgarPlate)
      };
   }
}


