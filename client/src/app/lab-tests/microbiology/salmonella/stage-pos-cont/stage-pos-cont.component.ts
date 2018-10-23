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
   sampleTestUnitsType: string | null = null;

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

   testUnitsFormArray: FormArray | null = null;

   defaultNumIsolatesPerSelectiveAgarPlate = 2;

   // Differences in test numbers represented here vs Vidas positives.
   testUnitNumbersDiff: TestUnitNumbersDiff;
   testUnitNumbersDiffMessage: string | null = null;
   testUnitNumbersDiffMessageIsWarning = false;

   sampleTestUnitsTypeAbrev = 'sub/comp';


   constructor() { }

   ngOnChanges()
   {
      this.formInitialized = Object.keys(this.form.controls).length > 0;
      this.testUnitsFormArray = this.formInitialized ? this.form.get('positiveTestUnitContinuationTestss') as FormArray : null;

      this.sampleTestUnitsTypeAbrev = this.sampleTestUnitsType === 'subsample' ? 'sub' : 'comp';

      this.defaultNumIsolatesPerSelectiveAgarPlate =
         this.testConfig ? this.testConfig.positiveTestUnitsMinimumIsolatesPerSelectiveAgar || 2 : 2;

      this.refreshTestUnitNumbersDiff();
   }

   addOnePositiveTestUnitContinuationTestsFormGroup()
   {
      if ( !this.formInitialized )
         this.initFormGroup();

      const onePosContTests: PositiveTestUnitContinuationTests = this.makeOnePositiveTestUnitContinuationTests();

      this.testUnitsFormArray.push(makePositiveTestUnitContinuationTestsFormGroup(onePosContTests));
   }

   addUnrepresentedVidasPositivesContinuationTestsFormGroups()
   {
      if ( !this.formInitialized )
         this.initFormGroup();

      for ( const newTestUnitNum of this.testUnitNumbersDiff.unrepresentedVidasPositives )
      {
         const testUnitContTests = this.makeOnePositiveTestUnitContinuationTests(newTestUnitNum);
         const testUnitContTestsFormGroup = makePositiveTestUnitContinuationTestsFormGroup(testUnitContTests);
         this.testUnitsFormArray.push(testUnitContTestsFormGroup);
      }

      this.refreshTestUnitNumbersDiff();
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
         this.testUnitsFormArray = this.form.get('positiveTestUnitContinuationTestss') as FormArray;
      }
      else
         console.log('Ignoring attempt to add positives continuation controls form group when this form group is already present.');
   }

   private makeOnePositiveTestUnitContinuationTests(testUnitNumber: number | null = null): PositiveTestUnitContinuationTests
   {
      return {
         testUnitNumber,
         rvSourcedTests: makeEmptySelectiveAgarsTestSuite(this.defaultNumIsolatesPerSelectiveAgarPlate),
         ttSourcedTests: makeEmptySelectiveAgarsTestSuite(this.defaultNumIsolatesPerSelectiveAgarPlate)
      };
   }

   private makeRepresentedTestUnitNumbersDiffVsVidas(): TestUnitNumbersDiff
   {
      return {
         unrepresentedVidasPositives: this.getUnrepresentedVidasPositiveTestUnitNumbers(),
         representedNotVidasPositive: this.getRepresentedNonVidasPositiveTestUnitNumbers(),
      };
   }

   private getRepresentedTestUnitNumbers(): number[]
   {
      if ( this.testUnitsFormArray == null )
         return [];

      const testUnitNumbers = [];

      for ( const posTestUnitContTestsCtl of this.testUnitsFormArray.controls )
      {
         const testUnitNumCtl = posTestUnitContTestsCtl.get('testUnitNumber');
         const testNum = testUnitNumCtl ? parseInt(testUnitNumCtl.value) : NaN;
         if ( testNum )
            testUnitNumbers.push(testNum);
      }

      return testUnitNumbers;
   }

   private getUnrepresentedVidasPositiveTestUnitNumbers(): number[]
   {
      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return [];

      const testUnitNums = new Set(this.vidasPositiveSampleTestUnitNumbers);

      for ( const repTestUnitNum of this.getRepresentedTestUnitNumbers() )
         testUnitNums.delete(repTestUnitNum);

      return Array.from(testUnitNums.values()).sort();
   }

   private getRepresentedNonVidasPositiveTestUnitNumbers(): number[]
   {
      const reprTestUnitNums = this.getRepresentedTestUnitNumbers();

      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return reprTestUnitNums;

      const excessTestUnitNums = new Set(reprTestUnitNums);

      for ( const vidasPosTestUnitNum of this.vidasPositiveSampleTestUnitNumbers )
         excessTestUnitNums.delete(vidasPosTestUnitNum);

      return Array.from(excessTestUnitNums.values()).sort();
   }

   onRepresentedTestUnitNumberChanged()
   {
      this.refreshTestUnitNumbersDiff();
   }

   removeTestUnitAtIndex(i: number)
   {
      this.testUnitsFormArray.removeAt(i);
      this.refreshTestUnitNumbersDiff();
   }

   private refreshTestUnitNumbersDiff()
   {
      this.testUnitNumbersDiff = this.makeRepresentedTestUnitNumbersDiffVsVidas();

      let isWarning = false;
      const msgs = [];
      if ( this.testUnitNumbersDiff.representedNotVidasPositive.length > 0 )
      {
         isWarning = true;
         msgs.push(
            'Sub/comp #\'s [' + this.testUnitNumbersDiff.representedNotVidasPositive + '] are not positive in Vidas results.'
         );
      }
      if ( this.testUnitNumbersDiff.unrepresentedVidasPositives.length > 0 )
      {
         isWarning = true;
         msgs.push(
            'Vidas positive sub/comp #\'s [' + this.testUnitNumbersDiff.unrepresentedVidasPositives + '] are absent here.'
         );
      }

      this.testUnitNumbersDiffMessage = msgs.length > 0 ? msgs.join(' ') : null;
      this.testUnitNumbersDiffMessageIsWarning = isWarning;
   }
}

interface TestUnitNumbersDiff {
   unrepresentedVidasPositives: number[];
   representedNotVidasPositive: number[];
}


