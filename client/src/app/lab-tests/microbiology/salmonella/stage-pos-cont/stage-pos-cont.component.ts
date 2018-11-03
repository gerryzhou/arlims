import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {
   makeEmptyContinuationControls,
   makeEmptySelectiveAgarsTestSuite, makeContinuationControlsFormGroup,
   makeContinuationTestsFormGroup, makeTestUnitsContinuationTestsFormGroup,
   PositivesContinuationData,
   ContinuationTests, countIsolates,
} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {TestConfig} from '../test-config';
import {AppUser} from '../../../../../generated/dto';

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

   @Input()
   appUser: AppUser;

   // Whether the child controls have been created in the form group yet.
   formInitialized = false;

   // The 'testUnitsContinuationTests' child control for the test unit continuation tests, if initialized.
   testUnitsFormGroup: FormGroup | null = null;

   defaultNumIsolatesPerSelectiveAgarPlate = 2;

   // Differences in test numbers represented here vs Vidas positives.
   testUnitNumbersDiff: TestUnitNumbersDiff;
   testUnitNumbersDiffMessage: string | null = null;
   testUnitNumbersDiffMessageIsWarning = false;

   sampleTestUnitsTypeAbrev = 'sub/comp';

   sortedTestUnitNums: number[];

   constructor() { }

   ngOnChanges()
   {
      this.formInitialized = Object.keys(this.form.controls).length > 0;
      this.testUnitsFormGroup = this.formInitialized ? this.form.get('testUnitsContinuationTests') as FormGroup : null;

      this.sampleTestUnitsTypeAbrev = this.sampleTestUnitsType === 'subsample' ? 'sub' : 'comp';

      this.defaultNumIsolatesPerSelectiveAgarPlate =
         this.testConfig ? this.testConfig.positiveTestUnitsMinimumIsolatesPerSelectiveAgar || 2 : 2;

      this.refreshTestUnitNumbersDependents();
   }

   addUnrepresentedVidasPositivesContinuationTestsFormGroups()
   {
      if ( !this.formInitialized )
         this.initFormGroup();

      for ( const newTestUnitNum of this.testUnitNumbersDiff.unrepresentedVidasPositives )
      {
         const emptyContTestsFormGroup = makeContinuationTestsFormGroup(this.makeEmptyContinuationTests());
         this.testUnitsFormGroup.addControl(newTestUnitNum.toString(), emptyContTestsFormGroup);
      }

      this.refreshTestUnitNumbersDependents();
   }

   private initFormGroup()
   {
      if ( !this.formInitialized )
      {
         const emptyTestUnitsFormGroup = makeTestUnitsContinuationTestsFormGroup({});
         const emptyContControlsFormGroup = makeContinuationControlsFormGroup(makeEmptyContinuationControls(this.appUser.username));

         this.form.addControl('testUnitsContinuationTests', emptyTestUnitsFormGroup);
         this.form.addControl('continuationControls', emptyContControlsFormGroup);

         this.formInitialized = true;
         this.testUnitsFormGroup = this.form.get('testUnitsContinuationTests') as FormGroup;
      }
      else
         console.log('Ignoring attempt to add positives continuation controls form group when this form group is already present.');
   }

   private makeEmptyContinuationTests(): ContinuationTests
   {
      const rvSourcedTests =
         makeEmptySelectiveAgarsTestSuite(1, this.defaultNumIsolatesPerSelectiveAgarPlate, this.appUser.username);

      const numRVIsolates = countIsolates(rvSourcedTests);

      const ttSourcedTests =
         makeEmptySelectiveAgarsTestSuite(numRVIsolates + 1, this.defaultNumIsolatesPerSelectiveAgarPlate, this.appUser.username);

      return { rvSourcedTests, ttSourcedTests };
   }

   removeTestUnitNumber(testUnitNum: number)
   {
      this.testUnitsFormGroup.removeControl(testUnitNum.toString());
      this.refreshTestUnitNumbersDependents();
   }

   private makeRepresentedTestUnitNumbersDiffVsVidas(): TestUnitNumbersDiff
   {
      return {
         unrepresentedVidasPositives: this.getUnrepresentedVidasPositiveTestUnitNumbers(),
         representedNotVidasPositive: this.getRepresentedNonVidasPositiveTestUnitNumbers(),
      };
   }

   private getSortedTestUnitNumbers(): number[]
   {
      if ( this.testUnitsFormGroup == null )
         return [];

      return (
         Object.keys(this.testUnitsFormGroup.controls)
         .map(testUnitNumStr => parseInt(testUnitNumStr))
         .sort()
      );
   }

   private getUnrepresentedVidasPositiveTestUnitNumbers(): number[]
   {
      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return [];

      const testUnitNums = new Set(this.vidasPositiveSampleTestUnitNumbers);

      for ( const repTestUnitNum of this.getSortedTestUnitNumbers() )
         testUnitNums.delete(repTestUnitNum);

      return Array.from(testUnitNums.values()).sort();
   }

   private getRepresentedNonVidasPositiveTestUnitNumbers(): number[]
   {
      const reprTestUnitNums = this.getSortedTestUnitNumbers();

      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return reprTestUnitNums;

      const excessTestUnitNums = new Set(reprTestUnitNums);

      for ( const vidasPosTestUnitNum of this.vidasPositiveSampleTestUnitNumbers )
         excessTestUnitNums.delete(vidasPosTestUnitNum);

      return Array.from(excessTestUnitNums.values()).sort();
   }

   private refreshTestUnitNumbersDependents()
   {
      this.sortedTestUnitNums = this.getSortedTestUnitNumbers();

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

