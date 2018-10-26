import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material';
import * as moment from 'moment';

import {copyWithMergedValuesFrom} from '../../../../shared/util/data-objects';
import {AlertMessageService, defaultJsonFieldFormatter, TestsService, UserContextService} from '../../../../shared/services';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {AppUser, LabResource} from '../../../../../generated/dto';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {
   emptyTestData,
   firstNonCompleteTestStageName,
   getTestStageStatuses, getVidasPositiveTestUnitNumbers,
   makeTestDataFormGroup,
   TEST_STAGES,
   TestData
} from '../test-data';
import {TestConfig} from '../test-config';
import {StagePrepComponent} from '../stage-prep/stage-prep.component';
import {StagePreEnrComponent} from '../stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from '../stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from '../stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from '../stage-vidas/stage-vidas.component';
import {StageControlsComponent} from '../stage-controls/stage-controls.component';
import {StagePosContComponent} from '../stage-pos-cont/stage-pos-cont.component';
import {StageWrapupComponent} from '../stage-wrapup/stage-wrapup.component';
import {makeSampleTestUnits, SampleTestUnits} from '../../sampling-methods';
import {AppInternalUrlsService} from '../../../../shared/services/app-internal-urls.service';

@Component({
   selector: 'app-micro-slm-staged-test-data-entry',
   templateUrl: './staged-test-data-entry.component.html',
   styleUrls: ['./staged-test-data-entry.component.scss'],
})
export class StagedTestDataEntryComponent implements OnInit {

   // The original test data and its md5 are needed for detecting and merging concurrent updates to the same data.
   originalTestData: TestData;
   originalTestDataMd5: string;

   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   // After a failed save, we can temporarily show values from another user's conflicting edits.
   conflictsTestData: TestData;
   conflictsEmployeeTimestamp: EmployeeTimestamp | null;

   showUnsetAffordances = false;

   sampleTestUnitsCount: number | null;
   sampleTestUnitsType: string | null;

   vidasPositiveSampleTestUnitNumbers: number[] | null;

   readonly stage: string | null;
   readonly stageIndex: number | null;

   readonly sampleInTest: SampleInTest;

   readonly testConfig: TestConfig | null;

   readonly appUser: AppUser | null;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;

   jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter;

   // Keep component refs for individual test stages to dispatch hotkeys to functions on the currently selected component.
   @ViewChild('testStageStepper') testStageStepper: MatStepper;
   @ViewChild(StagePrepComponent)     prepComp: StagePrepComponent;
   @ViewChild(StagePreEnrComponent)   preEnrComp: StagePreEnrComponent;
   @ViewChild(StageSelEnrComponent)   selEnrComp: StageSelEnrComponent;
   @ViewChild(StageMBrothComponent)   mBrothComp: StageMBrothComponent;
   @ViewChild(StageVidasComponent)    vidasComp: StageVidasComponent;
   @ViewChild(StageControlsComponent) controlsComp: StageControlsComponent;
   @ViewChild(StagePosContComponent)  posContComp: StagePosContComponent;
   @ViewChild(StageWrapupComponent)   wrapupComp: StageWrapupComponent;
   stageComps: any[];

   constructor
       (
          private activatedRoute: ActivatedRoute,
          private appUrlsSvc: AppInternalUrlsService,
          private testsSvc: TestsService,
          private alertMsgSvc: AlertMessageService,
          private router: Router,
          private usrCtxSvc: UserContextService
       )
   {
      const labGroupTestData: LabGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      const verTestData = labGroupTestData.versionedTestData;
      this.originalTestData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.originalTestDataMd5 = verTestData.modificationInfo.dataMd5;

      const stageParamValue = activatedRoute.snapshot.paramMap.get('stage');
      this.stage =
         stageParamValue ? stageParamValue
         : (firstNonCompleteTestStageName(this.originalTestData, labGroupTestData.labGroupTestConfig) || 'WRAPUP');
      const stageIx = TEST_STAGES.findIndex(ts => ts.name === this.stage);
      this.stageIndex = stageIx !== -1 ? stageIx : null;

      this.sampleInTest = labGroupTestData.sampleInTest;
      this.testConfig = labGroupTestData.labGroupTestConfig as TestConfig;
      this.appUser = labGroupTestData.appUser;

      this.testDataForm = makeTestDataFormGroup(this.originalTestData, labGroupTestData.appUser.username);

      const sm = this.originalTestData.preEnrData.samplingMethod;
      const sampleTestUnits = makeSampleTestUnits(sm.numberOfSubs, sm.numberOfComposites);
      this.sampleTestUnitsCount = sampleTestUnits.testUnitsCount;
      this.sampleTestUnitsType = sampleTestUnits.testUnitsType;

      this.vidasPositiveSampleTestUnitNumbers =
         this.originalTestData ? getVidasPositiveTestUnitNumbers(this.originalTestData.vidasData) : [];

      const labResources = labGroupTestData.labResourcesByType;
      this.balances = labResources.get(UserContextService.BALANCE_RESOURCE_TYPE);
      this.incubators = labResources.get(UserContextService.INCUBATOR_RESOURCE_TYPE);
      this.waterBaths = labResources.get(UserContextService.WATERBATH_RESOURCE_TYPE);
      this.vidasInstruments = labResources.get(UserContextService.VIDAS_RESOURCE_TYPE);

      this.conflictsTestData = emptyTestData();
      this.conflictsEmployeeTimestamp = null;
   }

   ngOnInit()
   {
      this.stageComps = [
         this.prepComp,
         this.preEnrComp,
         this.selEnrComp,
         this.mBrothComp,
         this.vidasComp,
         this.controlsComp,
         this.posContComp,
         this.wrapupComp
      ];
   }

   onFormSubmit()
   {
      console.log('Saving test data: ', this.testDataForm.value);

      this.testsSvc.saveTestData(
         this.sampleInTest.testMetadata.testId,
         this.testDataForm.value,
         this.originalTestData,
         this.originalTestDataMd5,
         testData => getTestStageStatuses(testData, this.testConfig),
         this.jsonFieldFormatter
      )
      .subscribe(
         saveResults => {
             if (saveResults.saved)
             {
                this.usrCtxSvc.refreshLabGroupContents();
                this.clearConflictsData();
                this.alertMsgSvc.alertSuccess('Test data saved.', true);
                this.testDataForm.markAsPristine();
                this.router.navigate(this.appUrlsSvc.samplesListingWithSampleExpanded(this.sampleInTest.sample.id));
             }
             else
             {
                const conflicts = saveResults.mergeConflicts;
                const modInfo = conflicts.dbModificationInfo;
                const msg = `Changes were not saved due to conflicting changes made by ${modInfo.savedByUserShortName}, ` +
                            'which should be highlighted below. Please adjust field values as necessary and save again.';
                this.testDataForm.patchValue(conflicts.mergedTestData);
                this.originalTestData = conflicts.dbTestData;
                this.originalTestDataMd5 = conflicts.dbModificationInfo.dataMd5;
                this.conflictsTestData = copyWithMergedValuesFrom(emptyTestData(), conflicts.conflictingDbValues);
                this.conflictsEmployeeTimestamp = {
                   employeeShortName: modInfo.savedByUserShortName,
                   timestamp: moment(modInfo.savedInstant, moment.ISO_8601).toDate(),
                };
                this.alertMsgSvc.alertWarning(msg);
             }
         },
         err => {
            console.log('Error occurred while trying to save test data, details below:');
            console.log(err);
            this.alertMsgSvc.alertDanger('An error occurred while trying to save test data. The test data may not have been saved.');
         });
   }

   hasUnsavedChanges(): boolean
   {
      return this.testDataForm.dirty;
   }

   onSampleTestUnitsChanged(testUnitsChange: SampleTestUnits)
   {
      this.sampleTestUnitsCount = testUnitsChange.testUnitsCount;
      this.sampleTestUnitsType = testUnitsChange.testUnitsType;
   }

   onVidasPositiveSampleTestUnitNumbersChanged(positiveTestUnits: number[])
   {
      this.vidasPositiveSampleTestUnitNumbers = positiveTestUnits;
   }

   clearConflictsData()
   {
      this.conflictsTestData = emptyTestData();
      this.conflictsEmployeeTimestamp = null;
   }

   @HostListener('window:keydown.F4')
   promptApplyResourcesInCurrentTestStage()
   {
      const selIx = this.testStageStepper.selectedIndex;
      if (selIx && selIx >= 0)
      {
         if (this.stageComps[selIx].promptAssignResources)
            this.stageComps[selIx].promptAssignResources();
      }
   }

   toggleShowUnsetAffordances()
   {
      this.showUnsetAffordances = !this.showUnsetAffordances;
   }
}
