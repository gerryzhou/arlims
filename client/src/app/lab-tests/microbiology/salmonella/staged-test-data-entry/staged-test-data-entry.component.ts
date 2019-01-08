import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import {copyWithMergedValuesFrom} from '../../../../shared/util/data-objects';
import {AlertMessageService, defaultJsonFieldFormatter, TestsService, UserContextService} from '../../../../shared/services';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {
   AppUser,
   LabResource,
   TestAttachedFileMetadata,
   SampleOpTest,
   TestSaveData,
   MicrobiologySampleAnalysisSubmissionResponse, MicrobiologySampleAnalysisSubmission, MicrobiologyAnalysisFinding
} from '../../../../../generated/dto';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {
   emptyTestData,
   firstNonCompleteTestStageName,
   getTestStageStatuses, getVidasPositiveTestUnitNumbers,
   makeTestDataFormGroup,
   TEST_STAGES,
   TestData, vidasStatusCode
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

@Component({
   selector: 'app-micro-slm-staged-test-data-entry',
   templateUrl: './staged-test-data-entry.component.html',
   styleUrls: ['./staged-test-data-entry.component.scss'],
})
export class StagedTestDataEntryComponent implements OnInit {

   readonly testConfig: TestConfig | null;

   // The original test data and its md5 are needed for detecting and merging concurrent updates to the same data.
   originalTestData: TestData;
   originalTestDataMd5: string;

   readonly attachedFilesByTestPart: Map<string|null, TestAttachedFileMetadata[]>;

   readonly sampleOpTest: SampleOpTest;

   readonly appUser: AppUser | null;


   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   // After a failed save, we can temporarily show values from another user's conflicting edits.
   conflictsTestData: TestData;
   conflictsEmployeeTimestamp: EmployeeTimestamp | null;

   showUnsetAffordances = false;

   sampleTestUnitsType: TestUnitsType | null;
   sampleTestUnitsCount: number | null;

   vidasPositiveSampleTestUnitNumbers: number[] | null;

   readonly stage: string | null;
   readonly stageIndex: number | null;

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
   @ViewChild('slantPosContComp')     slantPosContComp: PosContComponent;
   @ViewChild('identPosContComp')     identPosContComp: PosContComponent;
   @ViewChild(StageWrapupComponent)   wrapupComp: StageWrapupComponent;
   stageComps: any[];

   constructor
       (
          private testsSvc: TestsService,
          private usrCtxSvc: UserContextService,
          private appUrlsSvc: AppInternalUrlsService,
          private router: Router,
          private alertMsgSvc: AlertMessageService,
          private activatedRoute: ActivatedRoute
       )
   {
      const labGroupTestData: LabGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      this.testConfig = labGroupTestData.labGroupTestConfig as TestConfig;

      const verTestData = labGroupTestData.versionedTestData;
      this.originalTestData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.originalTestDataMd5 = verTestData.modificationInfo.dataMd5;

      this.attachedFilesByTestPart = makeAttachedFilesByTestPartMap(labGroupTestData);

      this.sampleOpTest = labGroupTestData.sampleOpTest;
      this.appUser = labGroupTestData.appUser;

      const stageParamValue = activatedRoute.snapshot.paramMap.get('stage');
      this.stage =
         stageParamValue ? stageParamValue
         : (firstNonCompleteTestStageName(this.originalTestData, labGroupTestData.labGroupTestConfig) || 'WRAPUP');
      const stageIx = TEST_STAGES.findIndex(ts => ts.name === this.stage);
      this.stageIndex = stageIx !== -1 ? stageIx : null;

      this.testDataForm = makeTestDataFormGroup(this.originalTestData, labGroupTestData.appUser.username);

      const sm = this.originalTestData.preEnrData.samplingMethod;
      this.sampleTestUnitsType = sm.testUnitsType;
      this.sampleTestUnitsCount = sm.testUnitsCount;

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
         this.slantPosContComp,
         this.identPosContComp,
         this.wrapupComp
      ];
   }

   saveTestData()
   {
      console.log('Saving test data: ', this.testDataForm.value);

      const testData = this.testDataForm.value;

      this.testsSvc.saveTestData(
         this.sampleOpTest.testMetadata.testId,
         testData,
         this.originalTestData,
         this.originalTestDataMd5,
         (td) => getTestStageStatuses(td, this.testConfig),
         this.jsonFieldFormatter
      )
      .subscribe(
         saveResults => {
             if ( saveResults.saved )
             {
                this.alertMsgSvc.alertSuccess('Test data saved.', true);
                /* TODO: Enable Vidas writing here when impl is finished.
                if ( this.stage === 'VIDAS' && this.shouldSubmitVidasAnalysisResults(testData) )
                {
                   console.log('Saving Vidas analysis data to FACTS.');
                   this.submitVidasAnalysisResults(testData).subscribe(factsSaveResponse => {
                      console.log('FACTS response for Vidas submission: ', factsSaveResponse)
                      this.alertMsgSvc.alertSuccess('Saved VIDAS results to FACTS.', true);
                      this.doAfterSaveNavigation();
                   });
                }
                else
                */
                this.doAfterSaveNavigation();
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
      // TODO: Set sample to expand as state in new context samples service instead of in the url.
      this.usrCtxSvc.refreshLabGroupContents();
      this.router.navigate(this.appUrlsSvc.samplesListingWithSampleExpanded(this.sampleOpTest.sampleOp.opId));
   }

   private shouldSubmitVidasAnalysisResults(testData: TestData): boolean
   {
      return vidasStatusCode(testData) === 'c';
   }

   /* TODO: Move this out into a separate (test-specific) service and complete.
   private submitVidasAnalysisResults(testData: TestData): Observable<MicrobiologySampleAnalysisSubmissionResponse>
   {
      // TODO: Should check test data for completeness here as values are extracted.

      const sample = this.sampleOpTest.sample;
      const positivesCount = countValueOccurrences(testData.vidasData.testUnitDetections, true);
      const samplingMethod = testData.preEnrData.samplingMethod;
      if ( !samplingMethod.testUnitsType )
      {
         this.alertMsgSvc.alertWarning('Cannot submit data to FACTS, the sampling method is incomplete in stage PRE-ENR.');
         return;
      }
      const examinedType = samplingMethod.testUnitsType === 'composite' ? 'COMPOSITES' : 'SUBSAMPLES';
      const examinedNumber = samplingMethod.testUnitsCount;
      const subSamplesUsedCompositeNumber = samplingMethod.testUnitsType === 'composite' ? samplingMethod.numberOfSubsPerComposite : null;
      const subSamplesDetectableFindingsNumber = samplingMethod.testUnitsType === 'subsample' ? positivesCount : null;
      const findings: MicrobiologyAnalysisFinding[] = []; // TODO

      const subm: MicrobiologySampleAnalysisSubmission = {
         operationId: sample.opId,
         accomplishingOrgName: this.appUser.labGroupFactsParentOrgName,
         actionIndicator: positivesCount > 0 ? 'Y' : 'N',
         problemCode: 'MICROID',
         genusCode: 'SLML',
         speciesCode: 'SLML998',
         methodSourceCode: 'AOAC',
         methodCode: 'T2004.03',
         // methodModificationIndicator: 'N',
         kitTestIndicator: 'N', // TODO: Y for spiking but then need to include kit test structure.
         examinedType,
         examinedNumber,
         subSamplesUsedCompositeNumber,
         subSamplesDetectableFindingsNumber,
         quantifiedIndicator: 'N',
         analysisResultsRemarksText: 'Posted from ALIS', // TODO
         analysisMicFindings: findings,
      };

      // TODO: Post the submission.

      return null;
   }
   */
}
