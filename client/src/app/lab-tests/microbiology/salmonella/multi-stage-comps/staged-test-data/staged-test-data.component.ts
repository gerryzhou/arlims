import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
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
} from '../../../../../../generated/dto';
import {
   TestData,
   emptyTestData,
   getTestStageStatuses,
   getVidasPositiveTestUnitNumbers,
   makeTestDataFormGroup,
   TEST_STAGES,
   NO_POSITIVES_TEST_STAGES,
   makeFactsSubmissionResultFormGroup,
   AOAC_BAM_SUBMT
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
import {FactsSubmissionProcessResults, FactsSubmissionResult} from '../../../../../shared/client-models/facts-submission-result-types';

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

   lastAnalysesSubm: FactsSubmissionResult | null;

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
   readonly factsSubmissionsResultsForm: FormGroup;

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
      this.factsSubmissionsResultsForm = this.testDataForm.get('factsSubmissionsResults') as FormGroup;

      this.lastAnalysesSubm = testData.factsSubmissionsResults[AOAC_BAM_SUBMT] || null;

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

   saveTestData(nav: AfterSaveNavigation = 'nav-none'): Observable<TestDataSaveResult>
   {
      const testData = this.testDataForm.value as TestData;

      const save$: Observable<TestDataSaveResult> =
         this.testsSvc.saveTestData(
            this.sampleOpTest.testMetadata.testId,
            testData,
            this.originalTestData,
            this.originalTestDataMd5,
            (td) => getTestStageStatuses(td, this.testConfig),
            this.jsonFieldFormatter
         )
         .pipe(
            map((saveResult: TestDataSaveResult) => {
               if ( saveResult.savedTestData != null )
                  this.onTestDataSaveSuccess(testData, saveResult.optimisticDataUpdateResult.savedMd5, nav);
               else
                  this.onTestDataSaveConflict(saveResult);
               return saveResult;
            })
         );

      save$.subscribe(
         () => {},
         err => this.onTestDataSaveError(err)
      );

      return save$;
   }

   submitFactsAnalyses(): Observable<FactsSubmissionProcessResults>
   {
      const res$ =
         this.saveTestData()
         .pipe(
            flatMap(saveRes => {
               const testData = saveRes.savedTestData;

               if ( !testData )
                  return of(({
                     preconditionFailures: ['Test data could not be saved prior to submission.'],
                     factsSubmissionResultsByType: {}
                  }));

               const preconditionFailures = getFactsSubmissionPreconditionFailures(testData);
               if ( preconditionFailures.length > 0 )
                  return of({
                     preconditionFailures,
                     factsSubmissionResultsByType: {}
                  });

               const submissionTimestamp = moment().format();

               return (
                  this.slmFactsService.submitAnalyses(
                     testData,
                     this.sampleOpTest.sampleOp.opId,
                     this.testConfig.aoacMethodCode || 'T2004.03',
                     this.appUser.labGroupFactsParentOrgName
                  )
                  .pipe(
                     map((createdAnalyses) => ({
                        preconditionFailures: [],
                        factsSubmissionResultsByType: {
                           [AOAC_BAM_SUBMT]: {
                              submissionTimestamp,
                              submissionSucceeded: true
                           }
                        }
                     })),
                     catchError(errRes => {
                        // TODO: Extract message from error structure.
                        const failureMessage = 'FACTS submission error (TODO)';
                        console.log('TODO: Extract FACTS error from structure: ', errRes);
                        return of({
                           preconditionFailures: [],
                           factsSubmissionResultsByType: {
                              [AOAC_BAM_SUBMT]: {
                                 submissionTimestamp,
                                 submissionSucceeded: false,
                                 failureMessage
                              }
                           }
                        });
                     }),
                  )
               );
            })
         );

      res$.subscribe(
         (res: FactsSubmissionProcessResults) => {
            if ( res.preconditionFailures.length > 0 ) // pre-conditions failed, no submission
               this.alertMsgSvc.alertWarning(
                  'Cannot Submit FACTS Data',
                  false,
                  res.preconditionFailures
               );
            else // submission attempted
            {
               const submResult = res.factsSubmissionResultsByType[AOAC_BAM_SUBMT];
               if  ( submResult ) // submission result exists
                  this.onFactsAnalysesSubmissionResult(submResult);
               else
                  console.error(`No ${AOAC_BAM_SUBMT} entry found in submission result: `, submResult);
            }
         },
         err => {
            // TODO: Extract message from error structure.
            console.log('TODO: Extract error message from structure: ', err);
            const msg = 'TODO';
            this.alertMsgSvc.alertWarning('FACTS Submission Failed', false, [msg]);
         }
      );

      return res$;
   }

   private onFactsAnalysesSubmissionResult(submResult: FactsSubmissionResult)
   {
      const submResCtrl = makeFactsSubmissionResultFormGroup(new FormBuilder(), submResult);
      this.factsSubmissionsResultsForm.setControl(AOAC_BAM_SUBMT, submResCtrl);
      this.lastAnalysesSubm = submResult;
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

   private onTestDataSaveSuccess(testData: TestData, savedMd5: string, nav: AfterSaveNavigation)
   {
      this.usrCtxSvc.requestDeferredLabGroupContentsRefresh();

      this.originalTestData = testData;
      this.originalTestDataMd5 = savedMd5;
      this.testDataForm.markAsPristine();

      if ( this.testIsNew )
      {
         const opId = this.sampleOpTest.sampleOp.opId;
         this.generalFactsService.setSampleOperationWorkStatus(opId, 'I', this.appUser.factsPersonId).subscribe(
            () => { console.log('FACTS status updated for new test.'); },
            err => this.onFactsStatusUpdateError(err)
         );
         this.testIsNew = false;
      }


      this.doAfterSaveNavigation(nav);
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

   private onTestDataSaveConflict(saveResult: TestDataSaveResult)
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

