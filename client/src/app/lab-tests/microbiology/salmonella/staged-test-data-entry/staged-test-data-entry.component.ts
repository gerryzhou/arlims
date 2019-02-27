import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import {copyWithMergedValuesFrom} from '../../../../shared/util/data-objects';
import {AlertMessageService, defaultJsonFieldFormatter, SaveResult, TestsService, UserContextService} from '../../../../shared/services';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {
   AppUser,
   LabResource,
   TestAttachedFileMetadata,
   SampleOpTest,
   TestSaveData,
   CreatedSampleAnalysisMicrobiology
} from '../../../../../generated/dto';
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
import {PosContComponent} from '../pos-cont-stages/pos-cont.component';
import {StageWrapupComponent} from '../stage-wrapup/stage-wrapup.component';
import {SampleTestUnits, TestUnitsType} from '../../sampling-methods';
import {AppInternalUrlsService} from '../../../../shared/services/app-internal-urls.service';
import {makeAttachedFilesByTestPartMap} from '../../../../shared/util/lab-group-data-utils';
import {FactsPostingService} from '../facts-posting.service';
import {SelectedSampleOpsService} from '../../../../shared/services/selected-sample-ops.service';

@Component({
   selector: 'app-micro-slm-staged-test-data-entry',
   templateUrl: './staged-test-data-entry.component.html',
   styleUrls: ['./staged-test-data-entry.component.scss'],
})
export class StagedTestDataEntryComponent implements OnInit {

   readonly testConfig: TestConfig | null;

   // Original test data and md5 are for detecting and merging concurrent updates.
   originalTestData: TestData;
   originalTestDataMd5: string;
   testIsNew: boolean;

   readonly attachedFilesByTestPart: Map<string | null, TestAttachedFileMetadata[]>;

   readonly sampleOpTest: SampleOpTest;

   readonly appUser: AppUser;


   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   // After a failed save, we can temporarily show values from another user's conflicting edits.
   conflictsTestData: TestData;
   conflictsEmployeeTimestamp: EmployeeTimestamp | null;

   // Controls whether a null option is shown for some ui choice components.
   showUnsetAffordances = false;

   sampleTestUnitsType: TestUnitsType | null;
   sampleTestUnitsCount: number | null;

   vidasPositiveSampleTestUnitNumbers: number[] | null;

   readonly initialStageIndex: number | null;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;

   jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter;

   // Keep component refs for individual test stages to dispatch hotkeys to functions on the currently selected component.
   @ViewChild('testStageStepper') testStageStepper: MatStepper;
   @ViewChild(StagePrepComponent) prepComp: StagePrepComponent;
   @ViewChild(StagePreEnrComponent) preEnrComp: StagePreEnrComponent;
   @ViewChild(StageSelEnrComponent) selEnrComp: StageSelEnrComponent;
   @ViewChild(StageMBrothComponent) mBrothComp: StageMBrothComponent;
   @ViewChild(StageVidasComponent) vidasComp: StageVidasComponent;
   @ViewChild('slantPosContComp') slantPosContComp: PosContComponent;
   @ViewChild('identPosContComp') identPosContComp: PosContComponent;
   @ViewChild(StageWrapupComponent) wrapupComp: StageWrapupComponent;
   stageComps: any[];

   readonly DEFAULT_AOAC_METHOD_CODE = 'T2004.03';

   constructor
      (
         private factsPostingService: FactsPostingService,
         private testsSvc: TestsService,
         private usrCtxSvc: UserContextService,
         private selectedSamplesSvc: SelectedSampleOpsService,
         private appUrlsSvc: AppInternalUrlsService,
         private router: Router,
         private alertMsgSvc: AlertMessageService,
         private activatedRoute: ActivatedRoute
      )
   {
      const labGroupTestData: LabGroupTestData = activatedRoute.snapshot.data['labGroupTestData'];
      const testConfig = labGroupTestData.labGroupTestConfig as TestConfig;
      this.testConfig = testConfig;

      const verTestData = labGroupTestData.versionedTestData;
      this.testIsNew = verTestData.testDataJson == null;
      const testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.originalTestData = testData;
      this.originalTestDataMd5 = verTestData.modificationInfo.dataMd5;

      this.attachedFilesByTestPart = makeAttachedFilesByTestPartMap(labGroupTestData);

      this.sampleOpTest = labGroupTestData.sampleOpTest;
      this.appUser = labGroupTestData.appUser;

      const initialStage =
         activatedRoute.snapshot.paramMap.get('stage') ||
         firstNonCompleteTestStageName(testData, testConfig) ||
         'WRAPUP';
      const stageIx = TEST_STAGES.findIndex(ts => ts.name === initialStage);
      this.initialStageIndex = stageIx !== -1 ? stageIx : null;

      this.testDataForm = makeTestDataFormGroup(testData, labGroupTestData.appUser.username, testConfig);

      const sm = testData.preEnrData.samplingMethod;
      this.sampleTestUnitsType = sm.testUnitsType;
      this.sampleTestUnitsCount = sm.testUnitsCount;

      this.vidasPositiveSampleTestUnitNumbers = testData ? getVidasPositiveTestUnitNumbers(testData.vidasData) : [];

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
         this.slantPosContComp,
         this.identPosContComp,
         this.wrapupComp
      ];
   }

   saveTestData()
   {
      const testData = this.testDataForm.value as TestData;

      this.testsSvc.saveTestData(
         this.sampleOpTest.testMetadata.testId,
         testData,
         this.originalTestData,
         this.originalTestDataMd5,
         (td) => getTestStageStatuses(td, this.testConfig),
         this.jsonFieldFormatter
      )
      .subscribe(
         (saveResult: SaveResult) => {
            if ( saveResult.savedMd5 )
               this.onTestDataSaveSuccess(testData, saveResult.savedMd5);
            else
               this.onTestDataSaveConflict(saveResult);
         },
         err => this.onTestDataSaveError(err)
      );
   }

   private onTestDataSaveSuccess(testData: TestData, savedMd5: string)
   {
      this.originalTestData = testData;
      this.originalTestDataMd5 = savedMd5;

      if ( this.testIsNew )
      {
         this.factsPostingService
            .setSampleOperationWorkStatus(this.sampleOpTest.sampleOp.opId, 'I', this.appUser.factsPersonId)
            .subscribe(
               () => { console.log('FACTS status updated for new test.'); },
               err => this.onFactsStatusUpdateError(err)
            );
         this.testIsNew = false;
      }

      switch ( this.visibleStageName() )
      {
         case 'VIDAS':
            if ( this.ensureTestDataCompleteForAOACFactsSubmitOrWarn(testData) )
               this.submitAOACDataToFactsAsync(testData);
            break;
         case 'WRAPUP':
            if ( this.vidasPositiveSampleTestUnitNumbers.length > 0 )
            {
               if ( this.ensureTestDataCompleteForBAMFactsSubmitOrWarn(testData) )
                  this.submitBAMDataToFactsAsync(testData);
            }
            else
            {
               this.alertMsgSvc.alertSuccess(
                  'Test data saved, no positive findings are present ' +
                  'so no FACTS submission was done.', true
               );
               this.doAfterSaveNavigation();
            }
            break;
         default:
            this.alertMsgSvc.alertSuccess('Test data saved.', true);
            this.doAfterSaveNavigation();
      }
   }

   private submitAOACDataToFactsAsync(testData: TestData)
   {
      this.factsPostingService.submitAOACAnalysisResults(
         testData,
         this.sampleOpTest.sampleOp.opId,
         this.testConfig.aoacMethodCode || this.DEFAULT_AOAC_METHOD_CODE,
         this.appUser.labGroupFactsOrgName,
         this.appUser.labGroupFactsParentOrgName
      )
      .subscribe(
         submResponse => this.onAOACFactsSubmitResponseReceived(submResponse),
         err => this.onFactsSaveError(err)
      );
   }

   private submitBAMDataToFactsAsync(testData: TestData)
   {
      this.factsPostingService.submitBAMAnalysisResults(
         testData,
         this.sampleOpTest.sampleOp.opId,
         this.appUser.labGroupFactsOrgName,
         this.appUser.labGroupFactsParentOrgName
      )
      .subscribe(
         submResponse => this.onBAMFactsSubmitResponseReceived(submResponse),
         err => this.onFactsSaveError(err)
      );
   }

   private onTestDataSaveConflict(saveResult: SaveResult)
   {
     this.testIsNew = false;

     const conflicts = saveResult.mergeConflicts;
     const modInfo = conflicts.dbModificationInfo;
     const msg =
        'Changes were not saved due to the conflicting changes made by ' +
        modInfo.savedByUserShortName + ' highlighted below. Please adjust ' +
        'field values as necessary and save again.';

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

   private onAOACFactsSubmitResponseReceived
      (
         factsResponse: CreatedSampleAnalysisMicrobiology
      )
   {
      console.log('FACTS response for AOAC submission: ', factsResponse);
      this.alertMsgSvc.alertSuccess('Saved VIDAS results to FACTS.', true);
      this.doAfterSaveNavigation();
   }

   private onBAMFactsSubmitResponseReceived
       (
          factsResponse: CreatedSampleAnalysisMicrobiology
       )
   {
      console.log('FACTS response for BAM submission: ', factsResponse);
      this.alertMsgSvc.alertSuccess('Saved BAM results to FACTS.', true);
      this.doAfterSaveNavigation();
   }

   private onTestDataSaveError(err)
   {
      console.log('Error occurred while trying to save test data, details below:');
      console.log(err);

      this.alertMsgSvc.alertDanger(
         'An error occurred while trying to save test data. ' +
         'The test data may not have been saved.'
      );
   }

   private onFactsSaveError(err)
   {
      console.log('Error occurred while trying to post data to FACTS, details below:');
      console.log(err);

      this.alertMsgSvc.alertDanger(
         'An error occurred while trying to post data to FACTS. ' +
         'The data may not have been received properly by FACTS.'
      );
   }

   private onFactsStatusUpdateError(err)
   {
      console.log('Error occurred while trying to set FACTS status to in-progress, details below:');
      console.log(err);

      this.alertMsgSvc.alertDanger(
         'An error occurred while trying to set FACTS status to in-progress. ' +
         'The status update may not have been received properly by FACTS.'
      );
   }


   private ensureTestDataCompleteForAOACFactsSubmitOrWarn(testData: TestData): boolean
   {
      const sm = testData.preEnrData.samplingMethod;

      if ( sm == null || sm.testUnitsType == null || sm.testUnitsCount <= 0 )
      {
         this.alertMsgSvc.alertWarning(
            'Vidas data was not saved to FACTS at this time for the reasons listed below.',
            ['The sampling method data is incomplete.']
         );

         return false;
      }

      const vidas = testData.vidasData;

      if ( vidas.testUnitDetections == null ||
           vidas.testUnitDetections.length === 0 ||
           vidas.testUnitDetections.some(v => v == null) )
      {
         this.alertMsgSvc.alertWarning(
            'Vidas data was not saved to FACTS at this time for the reasons listed below.',
            ['The Vidas results data is incomplete.']
         );

         return false;
      }

      return true;
   }

   private ensureTestDataCompleteForBAMFactsSubmitOrWarn(testData: TestData): boolean
   {
      // TODO: Decide required items from test data for BAM submission and check here.
      return true;
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

   private clearConflictsData()
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

   promptSaveTestDataToFile()
   {
      const s = this.sampleOpTest.sampleOp;
      const td = this.testDataForm.value;
      const tmd = this.sampleOpTest.testMetadata;

      const saveData: TestSaveData = {
         testId: tmd.testId,
         testDataJson: JSON.stringify(td),
         stageStatusesJson: JSON.stringify(getTestStageStatuses(td, this.testConfig)),
      };

      const blob = new Blob([JSON.stringify(saveData)], {type: 'application/json;charset=utf-8'});

      const ts = moment().format('YYYY-MM-DD[@]HHmmss');

      const fileName = `${ts} ${s.sampleTrackingNum}-${s.sampleTrackingSubNum} ${tmd.testTypeShortName}.json`;

      FileSaver.saveAs(blob, fileName, true);
   }

   restoreTestDataFromSaveFile(files: FileList)
   {
      if ( files.length !== 1 )
      {
         console.log(`Expected save data files list of length 1, got list of length ${files.length}.`);
         return;
      }

      this.testsSvc.restoreTestData(Array.from(files)).subscribe(() => {
         this.alertMsgSvc.alertSuccess('Test data restored.', true);
         this.doAfterSaveNavigation();
      });
   }

   private doAfterSaveNavigation()
   {
      this.clearConflictsData();
      this.testDataForm.markAsPristine();
      this.usrCtxSvc.refreshLabGroupContents();
      this.selectedSamplesSvc.setSelectedSampleOps([this.sampleOpTest.sampleOp]);
      this.router.navigate(this.appUrlsSvc.samplesListing());
   }

   private visibleStageName(): String | null
   {
      if ( this.testStageStepper.selected )
         return this.testStageStepper.selected.label;
      return null;
   }
}
