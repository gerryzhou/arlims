import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import {
   AlertMessageService,
   defaultJsonFieldFormatter,
   TestsService,
   UserContextService
} from '../../../../../shared/services';
import {LabGroupTestData} from '../../../../../shared/client-models/lab-group-test-data';
import {
   AppUser,
   LabResource,
   TestAttachedFileMetadata,
   SampleOpTest,
   TestSaveData,
   UserReference,
   DataModificationInfo,
} from '../../../../../../generated/dto';
import {
   TestData,
   emptyTestData,
   getTestStageStatuses,
   getVidasPositiveTestUnitNumbers,
   makeTestDataFormGroup,
   TEST_STAGES,
   NO_POSITIVES_TEST_STAGES,
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
import {TestDataSaveResult} from '../../../../../shared/client-models/test-data-save-result';

@Component({
   selector: 'app-micro-slm-staged-test-data',
   templateUrl: './staged-test-data.component.html',
   styleUrls: ['./staged-test-data.component.scss'],
})
export class StagedTestDataComponent implements OnInit {

   // Keep original test data and md5, as loaded or at last save, for detecting and merging concurrent updates.
   originalTestData: TestData;
   originalTestDataMd5: string;
   testIsNew: boolean;

   sampleTestUnitsType: TestUnitsType | null;
   sampleTestUnitsCount: number | null;

   vidasPositiveTestUnitNumbers: number[] | null;
   showPositiveContinuationStages: boolean;

   currentStage: string;

   // Controls whether a null option is shown for some ui choice components.
   showUnsetAffordances = false;
   allowFreeformEntryForSelectFields = false;

   readonly allowDataChanges: boolean;

   readonly testConfig: TestConfig | null;

   readonly attachedFilesByTestPart: Map<string | null, TestAttachedFileMetadata[]>;

   readonly sampleOpTest: SampleOpTest;

   readonly appUser: AppUser;
   readonly userIsAdmin: boolean;

   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;
   readonly prepForm: FormGroup;
   readonly preEnrForm: FormGroup;
   readonly selEnrForm: FormGroup;
   readonly mBrothForm: FormGroup;
   readonly vidasForm: FormGroup;
   readonly posContForm: FormGroup;
   readonly wrapupForm: FormGroup;

   readonly requestStage: string | null;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;
   readonly labGroupUsers: UserReference[];

   readonly jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter;

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
      this.prepForm = this.testDataForm.get('prepData') as FormGroup;
      this.preEnrForm = this.testDataForm.get('preEnrData') as FormGroup;
      this.selEnrForm = this.testDataForm.get('selEnrData') as FormGroup;
      this.mBrothForm = this.testDataForm.get('mBrothData') as FormGroup;
      this.vidasForm = this.testDataForm.get('vidasData') as FormGroup;
      this.posContForm = this.testDataForm.get('posContData') as FormGroup;
      this.wrapupForm = this.testDataForm.get('wrapupData') as FormGroup;

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
      this.currentStage = availableStages[this.testStageStepper.selectedIndex].name;
      this.testStageStepper.selectionChange.subscribe(e => {
         if ( e && e.selectedStep )
            this.currentStage = e.selectedStep.label;
      });
   }

   // Save test data with user interaction.
   onSaveTestDataClicked(nav: AfterSaveNavigation = 'nav-none')
   {
      if ( this.testIsNew )
      {
         this.submitInProgressFactsStatus();
         this.testIsNew = false;
      }

      this.saveTestData().subscribe(
         saveResult => {
            const conflictInfo = saveResult.optimisticDataUpdateResult.concurrentDataModificationInfo;
            if ( conflictInfo )
               this.promptHandleTestDataSaveConflict(conflictInfo);
            else
               this.doAfterSaveNavigation(nav);
         },
         err => {
            this.alertMsgSvc.alertDanger('Failed to save test data due to error.');
            console.error(err);
         }
      );
   }

   // Save test data and update component state according to results without any user interaction.
   private saveTestData(): Observable<TestDataSaveResult>
   {
      const testId = this.sampleOpTest.testMetadata.testId;
      const testData = this.testDataForm.value as TestData;
      const stageStatuses = getTestStageStatuses(testData, this.testConfig);

      return (
         this.testsSvc.saveTestData(
            testId,
            testData,
            this.originalTestData,
            this.originalTestDataMd5,
            stageStatuses,
            this.jsonFieldFormatter
         )
         .pipe(
            map((saveResult: TestDataSaveResult) => {
               if ( saveResult.savedTestData != null )
               {
                  this.originalTestData = testData;
                  this.originalTestDataMd5 = saveResult.optimisticDataUpdateResult.savedMd5;
                  this.testDataForm.markAsPristine();
                  this.usrCtxSvc.requestDeferredLabGroupContentsRefresh();
               }
               return saveResult;
            })
         )
      );
   }

   onSubmitFactsAnalysesClicked(): Observable<void>
   {
      const factsSubmission$ = this.submitFactsAnalyses();

      factsSubmission$.subscribe(
         (res: FactsSubmissionProcessResult) => {
            if ( res.preconditionFailures.length > 0 ) // pre-conditions failed, no submission
               this.alertMsgSvc.alertWarning('Cannot Submit FACTS Data', false, res.preconditionFailures);
            else // submission attempted
            {
               if  ( res.submissionResult.submissionSucceeded )
               {
                  this.alertMsgSvc.alertInfo(
                     'The test data was successfully submitted to FACTS.'
                  );
               }
               else
               {
                  this.alertMsgSvc.alertDanger(
                     'Submission of test data to FACTS failed.',
                     false,
                     [res.submissionResult.failureMessage]
                  );
               }
            }
         },
         err => {
            console.log('Facts submission error: ', err);
            const msg = 'FACTS submission resulted in an error, see console for details.';
            this.alertMsgSvc.alertWarning('FACTS Submission Failed', false, [msg]);
         }
      );

      return factsSubmission$.pipe(map(() => {}));
   }

   // Submit FACTS analyses and update form data with latest submission attempt,
   // without any user interaction.
   private submitFactsAnalyses(): Observable<FactsSubmissionProcessResult>
   {
      return this.saveTestData().pipe(flatMap(saveRes => {

         const testData = saveRes.savedTestData;

         if ( !testData )
            return of(({
               preconditionFailures: ['Test data could not be saved prior to submission.'],
               submissionResult: null
            }));

         const preconditionFailures = getFactsSubmissionPreconditionFailures(testData);
         if ( preconditionFailures.length > 0 )
            return of({
               preconditionFailures,
               submissionResult: null
            });

         const submissionTimestamp = moment().format();

         return (
            this.slmFactsService.submitAnalyses(
               testData,
               this.sampleOpTest.sampleOp.opId,
               this.appUser.factsFdaOrgName,
               this.testConfig
            )
            .pipe(
               map((createdAnalyses) => {
                  return ({
                     preconditionFailures: [],
                     submissionResult: {
                        submissionTimestamp,
                        submissionSucceeded: true
                     }
                  });
               }),
               catchError(errRes => {
                  console.error('FACTS submission error: ', errRes);
                  const msgStruct: any = errRes.error && errRes.error.message ?
                     JSON.parse(errRes.error && errRes.error.message)
                     : null;
                  const labsDsErrCode = msgStruct[0] && msgStruct[0].errorCode || null;
                  const labsDsErrMsg =  msgStruct[0] && msgStruct[0].message || null;
                  const msg = labsDsErrCode && labsDsErrMsg ?
                     'Validation Failure [' + labsDsErrCode + ']: ' + labsDsErrMsg +
                     ' [ The browser console may have further details. ]'
                     : 'see console for details';
                  return of({
                     preconditionFailures: [],
                     submissionResult: {
                           submissionTimestamp,
                           submissionSucceeded: false,
                           failureMessage: msg
                     }
                  });
               }), // catchError
            ) // pipe
         );
      }));
   }

   saveTimeChargesToFacts()
   {
      this.wrapupComp.saveTimeChargesToFacts();
   }

   hasUnsavedChanges(): boolean
   {
      return this.testDataForm.dirty;
   }

   @HostListener('window:keydown.F4')
   promptApplyResourcesInCurrentTestStage()
   {
      const stageComp = this.stageComps[this.currentStage];

      if ( !stageComp )
         console.log('Failed to lookup current stage component, cannot apply resources.', this);
      else
      {
         if ( stageComp.promptApplyResources )
            stageComp.promptApplyResources();
      }
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

   toggleShowUnsetAffordances()
   {
      this.showUnsetAffordances = !this.showUnsetAffordances;
   }

   toggleAllowFreeformEntryForSelectFields()
   {
      this.allowFreeformEntryForSelectFields = !this.allowFreeformEntryForSelectFields;
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

   private promptHandleTestDataSaveConflict(concurrentMod: DataModificationInfo)
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

   private submitInProgressFactsStatus()
   {
      const opId = this.sampleOpTest.sampleOp.opId;
      const personId = this.appUser.factsPersonId;
      this.generalFactsService.setSampleOperationWorkStatus(opId, 'I', personId).subscribe(
         () => {
            console.log('FACTS status updated for new test.');
         },
         err => this.onFactsStatusUpdateError(err)
      );
   }

}

function getFactsSubmissionPreconditionFailures(testData: TestData): string[]
{
   return getAOACSubmissionPreconditionFailures(testData).concat(
      getBamSubmissionPreconditionFailures(testData)
   );
}

function getAOACSubmissionPreconditionFailures(testData: TestData): string[]
{
   const failures = [];

   const sm = testData.preEnrData.samplingMethod;
   if ( sm == null || sm.testUnitsType == null || sm.testUnitsCount <= 0 )
      failures.push('The sampling method data is incomplete.');

   const vidaDets = testData.vidasData && testData.vidasData.testUnitDetections || null;
   if ( vidaDets == null || vidaDets.length === 0 || vidaDets.some(v => v == null) )
      failures.push('The Vidas results data is incomplete.');

   return failures;
}

function getBamSubmissionPreconditionFailures(testData: TestData): string[]
{
   const failures = [];
   // TODO
   return failures;
}


type AfterSaveNavigation = 'nav-none' | 'nav-next-stage' | 'nav-home';


interface FactsSubmissionResult {
   submissionTimestamp: string;
   submissionSucceeded: boolean;
   failureMessage?: string | null;
}

interface FactsSubmissionProcessResult {
   preconditionFailures: string[];
   submissionResult: FactsSubmissionResult | null;
}

