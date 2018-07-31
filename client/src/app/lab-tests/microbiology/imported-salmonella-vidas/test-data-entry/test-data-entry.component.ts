import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';

import {AlertMessageService, ApiUrlsService, defaultJsonFieldFormatter,
        TestsService, UserContextService} from '../../../../shared/services';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {LabResource, LabResourceType} from '../../../../../generated/dto';
import {copyWithMergedValuesFrom} from '../../../../shared/util/data-objects';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {emptyTestData, getTestStageStatuses, TestData} from '../test-data';
import {TestConfig} from '../test-config';

@Component({
   selector: 'app-micro-imp-slm-vidas-test-data-entry',
   templateUrl: './test-data-entry.component.html',
   styleUrls: ['./test-data-entry.component.scss']
})
export class TestDataEntryComponent {

   // The original test data and its md5 are needed for detecting and merging concurrent updates to the same data.
   originalTestData: TestData;
   originalTestDataMd5: string;

   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   // After a failed save, we can temporarily show values from another user's conflicting edits.
   conflictsTestData: TestData;
   conflictsEmployeeTimestamp: EmployeeTimestamp | null;

   readonly stage: string | null;
   showAllStages: boolean;

   readonly sampleInTest: SampleInTest;

   readonly testConfig: TestConfig;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;

   jsonFieldFormatter: (key: string, value: any) => string = defaultJsonFieldFormatter;

   private static readonly BALANCE_RESOURCE_TYPE: LabResourceType = 'BAL';
   private static readonly INCUBATOR_RESOURCE_TYPE: LabResourceType = 'INC';
   private static readonly WATERBATH_RESOURCE_TYPE: LabResourceType = 'WAB';
   private static readonly VIDAS_RESOURCE_TYPE: LabResourceType = 'VID';

   constructor
       (
          private activatedRoute: ActivatedRoute,
          private apiUrls: ApiUrlsService,
          private testsSvc: TestsService,
          private alertMessageSvc: AlertMessageService,
          private router: Router,
          private usrCtxSvc: UserContextService
       )
   {
      const labGroupTestData: LabGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      const verTestData = labGroupTestData.versionedTestData;
      this.originalTestData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.originalTestDataMd5 = verTestData.modificationInfo.dataMd5;
      this.stage = activatedRoute.snapshot.paramMap.get('stage') || null;
      this.showAllStages = !this.stage;
      this.sampleInTest = labGroupTestData.sampleInTest;
      this.testConfig = labGroupTestData.labGroupTestConfig;
      this.testDataForm = makeTestDataFormGroup(this.originalTestData);

      const labResources = labGroupTestData.labResourcesByType;
      this.balances = labResources.get(TestDataEntryComponent.BALANCE_RESOURCE_TYPE);
      this.incubators = labResources.get(TestDataEntryComponent.INCUBATOR_RESOURCE_TYPE);
      this.waterBaths = labResources.get(TestDataEntryComponent.WATERBATH_RESOURCE_TYPE);
      this.vidasInstruments = labResources.get(TestDataEntryComponent.VIDAS_RESOURCE_TYPE);

      // TODO: Remove these artificial conflicts after testing.
      this.conflictsTestData = // emptyTestData();
         Object.assign(emptyTestData(), {controlsData: {bacterialControlsUsed: 'N'}});
      this.conflictsEmployeeTimestamp  = // null;
         { employeeShortName: 'JD', timestamp: new Date() };
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
            this.alertMessageSvc.alertSuccess('Test data saved.', true);
            this.router.navigate(['/samples', {expsmp: `${this.sampleInTest.sample.id}`}]);
         } else {
            const conflicts = saveResults.mergeConflicts;
            const modInfo = conflicts.dbModificationInfo;
            const msg = `Changes not saved: conflicting changes were made by ${modInfo.savedByUserShortName}: ` +
                        `${JSON.stringify(conflicts.conflictingDbValues)}.  Please incorporate changes and save again.`;
            this.testDataForm.setValue(conflicts.mergedTestData);
            this.originalTestData = conflicts.dbTestData;
            this.originalTestDataMd5 = conflicts.dbModificationInfo.dataMd5;
            this.conflictsTestData = copyWithMergedValuesFrom(emptyTestData(), conflicts.conflictingDbValues);
            this.conflictsEmployeeTimestamp = {
               employeeShortName: modInfo.savedByUserShortName,
               timestamp: moment(modInfo.savedInstant, moment.ISO_8601).toDate(),
            };
            this.alertMessageSvc.alertWarning(msg);
         }
      });
      // TODO: Catch observable errors, alert user via alert service that the save opearation failed and to try again.
   }

   clearConflictsData()
   {
      this.conflictsTestData = emptyTestData();
      this.conflictsEmployeeTimestamp = null;
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
         incubatorId: new FormControl(testData.preEnrData.incubatorId),

         sampleSpike: new FormControl(testData.preEnrData.sampleSpike),
         spikePlateCount: new FormControl(testData.preEnrData.spikePlateCount),

         positiveControlGrowth: new FormControl(testData.preEnrData.positiveControlGrowth),
         mediumControlGrowth: new FormControl(testData.preEnrData.mediumControlGrowth),
      }),
      selEnrData: new FormGroup({
         rvBatchId: new FormControl(testData.selEnrData.rvBatchId),
         ttBatchId: new FormControl(testData.selEnrData.ttBatchId),
         bgBatchId: new FormControl(testData.selEnrData.bgBatchId),
         i2kiBatchId: new FormControl(testData.selEnrData.i2kiBatchId),
         rvttWaterBathId: new FormControl(testData.selEnrData.rvttWaterBathId),
      }),
      mBrothData: new FormGroup({
         mBrothBatchId: new FormControl(testData.mBrothData.mBrothBatchId),
         mBrothWaterBathId: new FormControl(testData.mBrothData.mBrothWaterBathId),
      }),
      vidasData: new FormGroup({
         instrumentId: new FormControl(testData.vidasData.instrumentId),
         kitIds: new FormControl(testData.vidasData.kitIds),
         compositesDetection: new FormControl(testData.vidasData.compositesDetection),
         positiveControlDetection: new FormControl(testData.vidasData.positiveControlDetection),
         mediumControlDetection: new FormControl(testData.vidasData.mediumControlDetection),
         spikeDetection: new FormControl(testData.vidasData.spikeDetection),
      }),
      controlsData: new FormGroup({
         systemControlsPositiveControlGrowth: new FormControl(testData.controlsData.systemControlsPositiveControlGrowth),
         systemControlsMediaControlGrowth: new FormControl(testData.controlsData.systemControlsMediaControlGrowth),
         collectorControlsPositiveControlGrowth: new FormControl(testData.controlsData.collectorControlsPositiveControlGrowth),
         collectorControlsMediaControlGrowth: new FormControl(testData.controlsData.collectorControlsMediaControlGrowth),
         bacterialControlsUsed: new FormControl(testData.controlsData.bacterialControlsUsed),
      }),
      resultsData: new FormGroup({
         positiveCompositesCount: new FormControl(testData.resultsData.positiveCompositesCount),
      }),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
      }),
   });
}
