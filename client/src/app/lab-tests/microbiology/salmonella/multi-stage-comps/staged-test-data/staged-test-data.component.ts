import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import {AlertMessageService, defaultJsonFieldFormatter, SaveResult, TestsService, UserContextService} from '../../../../../shared/services';
import {LabGroupTestData} from '../../../../../shared/client-models/lab-group-test-data';
import {
   AppUser,
   LabResource,
   TestAttachedFileMetadata,
   SampleOpTest,
   TestSaveData,
   UserReference
} from '../../../../../../generated/dto';
import {
   TestData,
   emptyTestData,
   getTestStageStatuses,
   getVidasPositiveTestUnitNumbers,
   makeTestDataFormGroup,
   TEST_STAGES,
   NO_POSITIVES_TEST_STAGES
} from '../../test-data';
import {TestConfig} from '../../test-config';
import {StagePrepComponent} from '../../stage-comps/stage-prep/stage-prep.component';
import {StagePreEnrComponent} from '../../stage-comps/stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from '../../stage-comps/stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from '../../stage-comps/stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from '../../stage-comps/stage-vidas/stage-vidas.component';
import {PosContComponent} from '../../stage-comps/pos-cont-stages/pos-cont.component';
import {StageWrapupComponent} from '../../stage-comps/stage-wrapup/stage-wrapup.component';
import {SampleTestUnits, TestUnitsType} from '../../../sampling-methods';
import {AppInternalUrlsService} from '../../../../../shared/services/app-internal-urls.service';
import {makeAttachedFilesByTestPartMap} from '../../../../../shared/util/lab-group-data-utils';
import {SalmonellaFactsService} from '../../salmonella-facts.service';
import {SelectedSampleOpsService} from '../../../../../shared/services/selected-sample-ops.service';
import {GeneralFactsService} from '../../../../../shared/services/general-facts.service';

@Component({
   selector: 'app-micro-slm-staged-test-data',
   templateUrl: './staged-test-data.component.html',
   styleUrls: ['./staged-test-data.component.scss'],
})
export class StagedTestDataComponent implements OnInit {

   readonly allowDataChanges: boolean;

   readonly testConfig: TestConfig | null;

   // Original test data and md5 are for detecting and merging concurrent updates.
   originalTestData: TestData;
   originalTestDataMd5: string;
   testIsNew: boolean;

   readonly attachedFilesByTestPart: Map<string | null, TestAttachedFileMetadata[]>;

   readonly sampleOpTest: SampleOpTest;

   readonly appUser: AppUser;
   readonly userIsAdmin: boolean;


   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   // Controls whether a null option is shown for some ui choice components.
   showUnsetAffordances = false;
   allowFreeformEntryForSelectFields = false;

   sampleTestUnitsType: TestUnitsType | null;
   sampleTestUnitsCount: number | null;

   vidasPositiveTestUnitNumbers: number[] | null;
   showPositiveContinuationStages: boolean;

   readonly requestStage: string | null;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;
   readonly labGroupUsers: UserReference[];

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
   stageComps: { [stageName: string]: any };

   constructor
      (
         private slmFactsService: SalmonellaFactsService,
         private generalFactsService: GeneralFactsService,
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
      this.allowDataChanges = activatedRoute.snapshot.data && activatedRoute.snapshot.data['allowDataChanges'] || false;
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
      this.userIsAdmin = labGroupTestData.appUser.roles.find(role => role === 'ADMIN') != null;

      const posTestUnits = testData ? getVidasPositiveTestUnitNumbers(testData.vidasData) : [];
      this.vidasPositiveTestUnitNumbers = posTestUnits;
      this.showPositiveContinuationStages = posTestUnits.length > 0;

      this.requestStage = activatedRoute.snapshot.paramMap.get('stage');

      this.testDataForm = makeTestDataFormGroup(testData, labGroupTestData.appUser.username, testConfig);
      if ( !this.allowDataChanges )
         this.testDataForm.disable();

      const sm = testData.preEnrData.samplingMethod;
      this.sampleTestUnitsType = sm.testUnitsType;
      this.sampleTestUnitsCount = sm.testUnitsCount;

      const labResources = labGroupTestData.labResourcesByType;
      this.balances = labResources.get(UserContextService.BALANCE_RESOURCE_TYPE);
      this.incubators = labResources.get(UserContextService.INCUBATOR_RESOURCE_TYPE);
      this.waterBaths = labResources.get(UserContextService.WATERBATH_RESOURCE_TYPE);
      this.vidasInstruments = labResources.get(UserContextService.VIDAS_RESOURCE_TYPE);

      this.labGroupUsers = labGroupTestData.labGroupUsers;
   }

   ngOnInit()
   {
      this.stageComps = {
         'PREP': this.prepComp,
         'PRE-ENR': this.preEnrComp,
         'SEL-ENR': this.selEnrComp,
         'M-BROTH': this.mBrothComp,
         'VIDAS': this.vidasComp,
         'SLANT': this.slantPosContComp,
         'IDENT': this.identPosContComp,
         'WRAPUP': this.wrapupComp
      };

      const availableStages = this.vidasPositiveTestUnitNumbers.length > 0 ?
         TEST_STAGES
         : NO_POSITIVES_TEST_STAGES;
      const stageIx = availableStages.findIndex(s => s.name === this.requestStage);
      this.testStageStepper.selectedIndex = stageIx !== -1 ? stageIx : 0;
   }

   saveTestData(nav: AfterSaveNavigation)
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
               this.onTestDataSaveSuccess(testData, saveResult.savedMd5, nav);
            else
               this.onTestDataSaveConflict(saveResult);
         },
         err => this.onTestDataSaveError(err)
      );
   }

   private onTestDataSaveSuccess(testData: TestData, savedMd5: string, nav: AfterSaveNavigation)
   {
      this.originalTestData = testData;
      this.originalTestDataMd5 = savedMd5;

      if ( this.testIsNew )
      {
         const opId = this.sampleOpTest.sampleOp.opId;
         this.generalFactsService.setSampleOperationWorkStatus(opId, 'I', this.appUser.factsPersonId).subscribe(
            () => { console.log('FACTS status updated for new test.'); },
            err => this.onFactsStatusUpdateError(err)
         );
         this.testIsNew = false;
      }

      this.usrCtxSvc.requestDeferredLabGroupContentsRefresh();

      this.testDataForm.markAsPristine();
      this.doAfterSaveNavigation(nav);
   }

/* TODO: FACTS test submission methods (Micro/SLM). Maybe move this somewhere else when feature is re-enabled.
   private ensureTestDataCompleteForAOACFactsSubmitOrWarn(testData: TestData): boolean
   {
      const sm = testData.preEnrData.samplingMethod;

      // TODO: Return messages for a dedicated display area below when this is moved to a dedicated page or component.

      if ( sm == null || sm.testUnitsType == null || sm.testUnitsCount <= 0 )
      {
         this.alertMsgSvc.alertWarning(
            'Vidas data was not saved to FACTS at this time for the reasons listed below.',
            false,
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
            false,
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


   private submitAOACDataToFactsAsync(testData: TestData)
   {
      this.slmFactsService.submitAOACAnalysisResults(
         testData,
         this.sampleOpTest.sampleOp.opId,
         this.testConfig.aoacMethodCode || 'T2004.03',
         this.appUser.labGroupFactsOrgName,
         this.appUser.labGroupFactsParentOrgName
      )
      .subscribe(
         submResponse => this.onAOACFactsSubmitResponseReceived(submResponse),
         err => this.onFactsSaveError(err)
      );
   }

   private onAOACFactsSubmitResponseReceived
   (
      factsResponse: CreatedSampleAnalysisMicrobiology
   )
   {
      console.log('FACTS response for AOAC submission: ', factsResponse);
      // TODO: Update a dedicated message area here instead when this is moved to a separate page or component.
      // this.alertMsgSvc.alertSuccess('Saved VIDAS results to FACTS.', true);
      this.testDataForm.markAsPristine();
   }

   private submitBAMDataToFactsAsync(testData: TestData)
   {
      this.slmFactsService.submitBAMAnalysisResults(
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

   private onBAMFactsSubmitResponseReceived
   (
      factsResponse: CreatedSampleAnalysisMicrobiology
   )
   {
      console.log('FACTS response for BAM submission: ', factsResponse);
      // TODO: Update a dedicated message area here instead when this is moved to a separate page or component.
      // this.alertMsgSvc.alertSuccess('Saved BAM results to FACTS.', true);
      this.testDataForm.markAsPristine();
      this.doAfterSaveNavigation('nav-home');
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
*/

   private onTestDataSaveConflict(saveResult: SaveResult)
   {
      this.alertMsgSvc.alertDanger('Cannot save test data, concurrent changes by another user would be overwritten.');

      // TODO: - Save both test data values to a record in new conflicts table, then save this data forcing overwrite.
      //       - Alert user that there was a conflict, that this version of the data has overwritten the other,
      //         that the both versions have been saved, and conflicting data can be examined/merged later.
   }

   private onTestDataSaveError(err)
   {
      console.log('Error occurred while trying to save test data, details below:\n', err);

      this.alertMsgSvc.alertDanger(
         'An error occurred while trying to save test data. ' +
         'The test data may not have been saved.'
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
      this.vidasPositiveTestUnitNumbers = positiveTestUnits;
      this.showPositiveContinuationStages = this.vidasPositiveTestUnitNumbers.length > 0;
   }

   @HostListener('window:keydown.F4')
   promptApplyResourcesInCurrentTestStage()
   {
      const stageName = this.getStepperSelectedTestStageName();
      const stageComp = this.stageComps[stageName];

      if ( !stageComp )
         console.log('Failed to lookup current stage component, cannot apply resources.', this);
      else
      {
         if ( stageComp.promptApplyResources )
            stageComp.promptApplyResources();
      }
   }

   getStepperSelectedTestStageName(): string
   {
      return this.testStageStepper.selected.label;
   }

   toggleShowUnsetAffordances()
   {
      this.showUnsetAffordances = !this.showUnsetAffordances;
   }

   toggleAllowFreeformEntryForSelectFields()
   {
      this.allowFreeformEntryForSelectFields = !this.allowFreeformEntryForSelectFields;
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

      const fileName = `${ts} ${s.sampleTrackingNumber}-${s.sampleTrackingSubNumber} ${tmd.testTypeShortName}.json`;

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
         this.testDataForm.markAsPristine();
         this.doAfterSaveNavigation('nav-none');
      });
   }

   private doAfterSaveNavigation(nav: AfterSaveNavigation)
   {
      switch ( nav )
      {
         case 'nav-none': break;
         case 'nav-next-stage':
            this.testStageStepper.next();
            break;
         case 'nav-home':
            this.selectedSamplesSvc.setSelectedSampleOps([this.sampleOpTest.sampleOp]);
            this.router.navigate(this.appUrlsSvc.home());
            break;
      }
   }

   private visibleStageName(): String | null
   {
      if ( this.testStageStepper.selected )
         return this.testStageStepper.selected.label;
      return null;
   }

}

type AfterSaveNavigation = 'nav-none' | 'nav-next-stage' | 'nav-home';
