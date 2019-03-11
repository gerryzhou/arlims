import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

import {arraysEqual} from '../../../../shared/util/data-objects';
import {
   makeEmptyContinuationControls, makeEmptySelectiveAgarsTestSuite, makeContinuationControlsFormGroup, makeContinuationTestsFormGroup,
   makeTestUnitsContinuationTestsFormGroup, PositivesContinuationData, ContinuationTests, countIsolates,
} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {TestConfig} from '../test-config';
import {AppUser, TestAttachedFileMetadata} from '../../../../../generated/dto';
import {TestUnitsType} from '../../sampling-methods';

@Component({
   selector: 'app-pos-cont',
   templateUrl: './pos-cont.component.html',
   styleUrls: ['./pos-cont.component.scss']
})
export class PosContComponent implements OnChanges {

   @Input()
   form: FormGroup; // May be empty of controls until user chooses to initiate positives continuation tests.

   @Input()
   testId: number;

   @Input()
   stage: 'SLANT' | 'IDENT';

   @Input()
   showOtherStageDataAsContext = false;

   @Input()
   allowDataChanges: boolean;

   @Input()
   vidasPositiveSampleTestUnitNumbers: number[] | null = null;

   @Input()
   sampleTestUnitsType: TestUnitsType | null = null;

   @Input()
   attachedFilesByTestPart: Map<string|null, TestAttachedFileMetadata[]>;

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

   defaultNumIsolatesPerSelectiveAgarPlate = 2;

   // Differences in test numbers represented here vs Vidas positives.
   testUnitNumbersDiff: TestUnitNumbersDiff;
   testUnitNumbersDiffMessage: string | null = null;
   testUnitNumbersDiffMessageIsWarning = false;

   sampleTestUnitsTypeAbrev = 'sub/comp';

   sortedTestUnitNums: number[] = [];

   identAttachedFiles: TestAttachedFileMetadata[];

   formSubscription: Subscription | null;

   readonly IDENT_ATTACHED_FILES_KEY = 'ident';

   constructor() {}

   ngOnChanges()
   {
      this.sampleTestUnitsTypeAbrev = this.sampleTestUnitsType === 'subsample' ? 'sub' : 'comp';

      this.defaultNumIsolatesPerSelectiveAgarPlate =
         this.testConfig ? this.testConfig.positiveTestUnitsMinimumIsolatesPerSelectiveAgar || 2 : 2;

      this.identAttachedFiles = this.attachedFilesByTestPart.get(this.IDENT_ATTACHED_FILES_KEY) || [];

      this.refreshTestUnitNumbersDependents();

      if ( this.formSubscription )
         this.formSubscription.unsubscribe();
      this.formSubscription = this.form.valueChanges.subscribe(() => {
         const testUnitNums = this.readSortedTestUnitNumbersFromForm();
         if ( !arraysEqual(testUnitNums, this.sortedTestUnitNums) )
         {
            this.refreshTestUnitNumbersDependents();
         }
      });

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

   addUnrepresentedVidasPositivesContinuationTestsFormGroups()
   {
      let testUnitsFormGroup = this.form.get('testUnitsContinuationTests') as FormGroup || null;
      if ( !testUnitsFormGroup )
      {
         this.initFormGroup();
         testUnitsFormGroup = this.form.get('testUnitsContinuationTests') as FormGroup;
      }

      for ( const newTestUnitNum of this.testUnitNumbersDiff.unrepresentedVidasPositives )
      {
         const emptyContTestsFormGroup = makeContinuationTestsFormGroup(this.makeEmptyContinuationTests());

         testUnitsFormGroup.addControl(newTestUnitNum.toString(), emptyContTestsFormGroup);
      }

      this.refreshTestUnitNumbersDependents();
   }

   private initFormGroup()
   {
      const emptyTestUnitsFormGroup = makeTestUnitsContinuationTestsFormGroup({});
      const emptyContControlsFormGroup = makeContinuationControlsFormGroup(makeEmptyContinuationControls(this.appUser.username));

      this.form.addControl('testUnitsContinuationTests', emptyTestUnitsFormGroup);
      this.form.addControl('continuationControls', emptyContControlsFormGroup);
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
      const testUnitsFormGroup = this.form.get('testUnitsContinuationTests') as FormGroup;
      testUnitsFormGroup.removeControl(testUnitNum.toString());

      this.refreshTestUnitNumbersDependents();
   }

   private makeRepresentedTestUnitNumbersDiffVsVidas(): TestUnitNumbersDiff
   {
      return {
         unrepresentedVidasPositives: this.getUnrepresentedVidasPositiveTestUnitNumbers(),
         representedNotVidasPositive: this.getRepresentedNonVidasPositiveTestUnitNumbers(),
      };
   }

   private readSortedTestUnitNumbersFromForm(): number[]
   {
      const testUnitsFormGroup = this.form.get('testUnitsContinuationTests') as FormGroup;

      if ( testUnitsFormGroup == null )
         return [];

      return (
         Object.keys(testUnitsFormGroup.controls)
         .map(testUnitNumStr => parseInt(testUnitNumStr))
         .sort()
      );
   }

   private getUnrepresentedVidasPositiveTestUnitNumbers(): number[]
   {
      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return [];

      const testUnitNums = new Set(this.vidasPositiveSampleTestUnitNumbers);

      for ( const repTestUnitNum of this.readSortedTestUnitNumbersFromForm() )
         testUnitNums.delete(repTestUnitNum);

      return Array.from(testUnitNums.values()).sort();
   }

   private getRepresentedNonVidasPositiveTestUnitNumbers(): number[]
   {
      const reprTestUnitNums = this.readSortedTestUnitNumbersFromForm();

      if ( this.vidasPositiveSampleTestUnitNumbers == null )
         return reprTestUnitNums;

      const excessTestUnitNums = new Set(reprTestUnitNums);

      for ( const vidasPosTestUnitNum of this.vidasPositiveSampleTestUnitNumbers )
         excessTestUnitNums.delete(vidasPosTestUnitNum);

      return Array.from(excessTestUnitNums.values()).sort();
   }

   private refreshTestUnitNumbersDependents()
   {
      this.sortedTestUnitNums = this.readSortedTestUnitNumbersFromForm();

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

   toggleShowOtherStageDataAsContext()
   {
      this.showOtherStageDataAsContext = !this.showOtherStageDataAsContext;
   }

   onIdentAttachedFilesChanged(attachedFiles: TestAttachedFileMetadata[])
   {
      this.identAttachedFiles = attachedFiles;
   }
}

interface TestUnitNumbersDiff {
   unrepresentedVidasPositives: number[];
   representedNotVidasPositive: number[];
}

