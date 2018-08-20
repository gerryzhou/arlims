import {ChangeDetectionStrategy, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';

import {AlertMessageService, ApiUrlsService, defaultJsonFieldFormatter,
        TestsService, UserContextService} from '../../../../shared/services';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {LabResource, LabResourceType} from '../../../../../generated/dto';
import {cloneDataObject, copyWithMergedValuesFrom} from '../../../../shared/util/data-objects';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {emptyTestData, firstNonCompleteTestStageName, getTestStageStatuses, TEST_STAGES, TestData} from '../test-data';
import {TestConfig} from '../test-config';
import {MatDialog, MatStepper} from '@angular/material';
import {StagePrepComponent} from '../stage-prep/stage-prep.component';
import {StagePreEnrComponent} from '../stage-pre-enr/stage-pre-enr.component';
import {StageSelEnrComponent} from '../stage-sel-enr/stage-sel-enr.component';
import {StageMBrothComponent} from '../stage-m-broth/stage-m-broth.component';
import {StageVidasComponent} from '../stage-vidas/stage-vidas.component';
import {StageControlsComponent} from '../stage-controls/stage-controls.component';
import {StageWrapupComponent} from '../stage-wrapup/stage-wrapup.component';
import {makeSampleTestUnits, SampleTestUnits} from '../../sampling-methods';

@Component({
   selector: 'app-micro-imp-slm-vidas-staged-test-data-entry',
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

   readonly stage: string | null;
   readonly stageIndex: number | null;

   readonly sampleInTest: SampleInTest;

   readonly testConfig: TestConfig;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;

   jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter;

   // Keep component refs for stepper and individual test stages to dispatch hotkeys to functions on the currently selected component.
   @ViewChild('testStageStepper') testStageStepper: MatStepper;
   @ViewChild(StagePrepComponent)     prepComp: StagePrepComponent;
   @ViewChild(StagePreEnrComponent)   preEnrComp: StagePreEnrComponent;
   @ViewChild(StageSelEnrComponent)   selEnrComp: StageSelEnrComponent;
   @ViewChild(StageMBrothComponent)   mBrothComp: StageMBrothComponent;
   @ViewChild(StageVidasComponent)    vidasComp: StageVidasComponent;
   @ViewChild(StageControlsComponent) controlsComp: StageControlsComponent;
   @ViewChild(StageWrapupComponent)   wrapupComp: StageWrapupComponent;
   stageComps: any[];

   private static readonly BALANCE_RESOURCE_TYPE: LabResourceType = 'BAL';
   private static readonly INCUBATOR_RESOURCE_TYPE: LabResourceType = 'INC';
   private static readonly WATERBATH_RESOURCE_TYPE: LabResourceType = 'WAB';
   private static readonly VIDAS_RESOURCE_TYPE: LabResourceType = 'VID';

   constructor
       (
          private activatedRoute: ActivatedRoute,
          private apiUrls: ApiUrlsService,
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
      this.stage = stageParamValue ? stageParamValue : (firstNonCompleteTestStageName(this.originalTestData) || 'WRAPUP');
      const stageIx = TEST_STAGES.findIndex(ts => ts.name === this.stage);
      this.stageIndex = stageIx !== -1 ? stageIx : null;

      this.sampleInTest = labGroupTestData.sampleInTest;
      this.testConfig = labGroupTestData.labGroupTestConfig;
      this.testDataForm = makeTestDataFormGroup(this.originalTestData);

      const sm = this.originalTestData.preEnrData.samplingMethod;
      const sampleTestUnits = makeSampleTestUnits(sm.numberOfSubs, sm.numberOfComposites);
      this.sampleTestUnitsCount = sampleTestUnits.testUnitsCount;
      this.sampleTestUnitsType = sampleTestUnits.testUnitsType;

      const labResources = labGroupTestData.labResourcesByType;
      this.balances = labResources.get(StagedTestDataEntryComponent.BALANCE_RESOURCE_TYPE);
      this.incubators = labResources.get(StagedTestDataEntryComponent.INCUBATOR_RESOURCE_TYPE);
      this.waterBaths = labResources.get(StagedTestDataEntryComponent.WATERBATH_RESOURCE_TYPE);
      this.vidasInstruments = labResources.get(StagedTestDataEntryComponent.VIDAS_RESOURCE_TYPE);

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
         getTestStageStatuses,
         this.jsonFieldFormatter
      )
      .subscribe(saveResults => {
         if (saveResults.saved) {
            this.usrCtxSvc.loadLabGroupContents();
            this.clearConflictsData();
            this.alertMsgSvc.alertSuccess('Test data saved.', true);
            this.router.navigate(['/samples', {expsmp: `${this.sampleInTest.sample.id}`}]);
         } else {
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
      });
      // TODO: Catch observable errors, alert user via alert service that the save opearation failed and to try again.
   }

   onSampleTestUnitsChanged(testUnitsChange: SampleTestUnits)
   {
      this.sampleTestUnitsCount = testUnitsChange.testUnitsCount;
      this.sampleTestUnitsType = testUnitsChange.testUnitsType;
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

function makeTestDataFormGroup(testData: TestData): FormGroup
{
   return new FormGroup({
      prepData: new FormGroup({
         sampleReceivedDate: new FormControl(testData.prepData.sampleReceivedDate),
         sampleReceivedFrom: new FormControl(testData.prepData.sampleReceivedFrom),
         descriptionMatchesCR: new FormControl(testData.prepData.descriptionMatchesCR),
         descriptionMatchesCRNotes: new FormControl(testData.prepData.descriptionMatchesCRNotes),
         labelAttachmentType: new FormControl(testData.prepData.labelAttachmentType),
         containerMatchesCR: new FormControl(testData.prepData.containerMatchesCR),
         containerMatchesCRNotes: new FormControl(testData.prepData.containerMatchesCRNotes),
         codeMatchesCR: new FormControl(testData.prepData.codeMatchesCR),
         codeMatchesCRNotes: new FormControl(testData.prepData.codeMatchesCRNotes),
      }),
      preEnrData: new FormGroup({
         samplingMethod: new FormGroup({
            numberOfComposites: new FormControl(testData.preEnrData.samplingMethod.numberOfComposites),
            numberOfSubsPerComposite: new FormControl(testData.preEnrData.samplingMethod.numberOfSubsPerComposite),
            extractedGramsPerSub: new FormControl(testData.preEnrData.samplingMethod.extractedGramsPerSub),
            numberOfSubs: new FormControl(testData.preEnrData.samplingMethod.numberOfSubs),
            compositeMassGrams: new FormControl(testData.preEnrData.samplingMethod.compositeMassGrams),
         }),
         samplingMethodExceptionsNotes: new FormControl(testData.preEnrData.samplingMethodExceptionsNotes),

         balanceId: new FormControl(testData.preEnrData.balanceId),
         blenderJarId: new FormControl(testData.preEnrData.blenderJarId),
         bagId: new FormControl(testData.preEnrData.bagId),
         mediumBatchId: new FormControl(testData.preEnrData.mediumBatchId),
         mediumType: new FormControl(testData.preEnrData.mediumType),
         incubatorId: new FormControl(testData.preEnrData.incubatorId),

         sampleSpike: new FormControl(testData.preEnrData.sampleSpike),
         positiveControlGrowth: new FormControl(testData.preEnrData.positiveControlGrowth),
         mediumControlGrowth: new FormControl(testData.preEnrData.mediumControlGrowth),
      }),
      selEnrData: new FormGroup({
         rvBatchId: new FormControl(testData.selEnrData.rvBatchId),
         ttBatchId: new FormControl(testData.selEnrData.ttBatchId),
         bgBatchId: new FormControl(testData.selEnrData.bgBatchId),
         i2kiBatchId: new FormControl(testData.selEnrData.i2kiBatchId),
         spikePlateCount: new FormControl(testData.selEnrData.spikePlateCount),
         rvttWaterBathId: new FormControl(testData.selEnrData.rvttWaterBathId),
      }),
      mBrothData: new FormGroup({
         mBrothBatchId: new FormControl(testData.mBrothData.mBrothBatchId),
         mBrothWaterBathId: new FormControl(testData.mBrothData.mBrothWaterBathId),
         waterBathStarted: new FormControl(testData.mBrothData.waterBathStarted), // TODO: Add ISO timestamp validator.
      }),
      vidasData: new FormGroup({
         instrumentId: new FormControl(testData.vidasData.instrumentId),
         kitIds: new FormControl(testData.vidasData.kitIds),
         testUnitDetections: new FormArray(
            (testData.vidasData.testUnitDetections || [null]).map(detected => new FormControl(detected))
         ),
         positiveControlDetection: new FormControl(testData.vidasData.positiveControlDetection),
         mediumControlDetection: new FormControl(testData.vidasData.mediumControlDetection),
         spikeDetection: new FormControl(testData.vidasData.spikeDetection),
      }),
      controlsData: new FormGroup({
         systemControlsUsed: new FormControl(testData.controlsData.systemControlsUsed),
         systemControlTypes: new FormControl(testData.controlsData.systemControlTypes),
         systemControlsGrowth: new FormControl(testData.controlsData.systemControlsGrowth),
         collectorControlsUsed: new FormControl(testData.controlsData.collectorControlsUsed),
         collectorControlTypes: new FormControl(testData.controlsData.collectorControlTypes),
         collectorControlsGrowth: new FormControl(testData.controlsData.collectorControlsGrowth),
         bacterialControlsUsed: new FormControl(testData.controlsData.bacterialControlsUsed),
      }),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
}

