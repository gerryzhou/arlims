import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiUrlsService, UserContextService} from '../../../../shared/services';
import {VersionedTestData} from '../../../../../generated/dto';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {cloneDataObject} from '../../../../shared/util/data-objects';
import {emptyTestData, TestData} from '../test-data';
import {FormControl, FormGroup} from '@angular/forms';
import {TestConfig} from '../test-config';
import {TestStageStatus} from '../../../test-stages';

@Component({
   selector: 'app-micro-imp-slm-vidas-test-data-entry',
   templateUrl: './test-data-entry.component.html',
   styleUrls: ['./test-data-entry.component.scss']
})
export class TestDataEntryComponent implements OnInit {

   readonly testData: TestData;

   readonly stage: string | null;
   showAllStages: boolean;

   // The original test data and its md5 are needed for detecting and merging concurrent updates to the same data.
   originalTestData: TestData;
   originalTestDataMd5: string;

   readonly sampleInTest: SampleInTest;

   readonly testConfig: TestConfig;

   readonly testDataForm: FormGroup;

   constructor(
      private activatedRoute: ActivatedRoute,
      private apiUrls: ApiUrlsService,
      usrCtxSvc: UserContextService
   ) {
      const verTestData: VersionedTestData = this.activatedRoute.snapshot.data['testData'];
      this.testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.stage = activatedRoute.snapshot.paramMap.get('stage') || null;
      this.showAllStages = !this.stage;
      this.originalTestData = cloneDataObject(this.testData);
      this.originalTestDataMd5 = verTestData.modificationInfo.dataMd5;

      this.sampleInTest = usrCtxSvc.getSampleInTest(verTestData.testId);
      if ( !this.sampleInTest ) {
         throw new Error('Sample not found for test id ' + verTestData.testId);
      }

      const configJson = usrCtxSvc.getLabGroupTestConfigJson(this.sampleInTest.testMetadata.testTypeCode);
      if (configJson) {
         this.testConfig = JSON.parse(configJson);
      }

      this.testDataForm = makeTestDataFormGroup(this.testData);
   }

   ngOnInit() {
   }

   onFormSubmit() {
      console.log('Form value:');
      console.log(this.testDataForm.getRawValue());
      // TODO
   }

}

function makeTestDataFormGroup(testData: TestData): FormGroup {
   return new FormGroup({
      prepData: new FormGroup({
         sampleReceived: new FormControl(testData.prepData.sampleReceived), // TODO: Add date validator.
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
            extractedGramsPerSub: new FormControl(testData.preEnrData.samplingMethod.extractedGramsPerSub),
            numberOfComposites: new FormControl(testData.preEnrData.samplingMethod.numberOfComposites),
            compositeMassGrams: new FormControl(testData.preEnrData.samplingMethod.compositeMassGrams),
            numberOfSubsPerComposite: new FormControl(testData.preEnrData.samplingMethod.numberOfSubsPerComposite),
            numberOfSubs: new FormControl(testData.preEnrData.samplingMethod.numberOfSubs),
         }),
         balanceId: new FormControl(testData.preEnrData.balanceId),
         blenderJarId: new FormControl(testData.preEnrData.blenderJarId),
         bagId: new FormControl(testData.preEnrData.bagId),
         sampleSpike: new FormControl(testData.preEnrData.sampleSpike),
         spikePlateCount: new FormControl(testData.preEnrData.spikePlateCount),
         preenrichMediumBatchId: new FormControl(testData.preEnrData.preenrichMediumBatchId),
         preenrichIncubatorId: new FormControl(testData.preEnrData.preenrichIncubatorId),
         preenrichPositiveControlGrowth: new FormControl(testData.preEnrData.preenrichPositiveControlGrowth),
         preenrichMediumControlGrowth: new FormControl(testData.preEnrData.preenrichMediumControlGrowth),
      }),
      selEnrData: new FormGroup({
         rvBatchId: new FormControl(testData.selEnrData.rvBatchId),
         ttBatchId: new FormControl(testData.selEnrData.ttBatchId),
         bgBatchId: new FormControl(testData.selEnrData.bgBatchId),
         l2KiBatchId: new FormControl(testData.selEnrData.l2KiBatchId),
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
         systemMediumPositiveControlGrowth: new FormControl(testData.controlsData.systemMediumPositiveControlGrowth),
         collectorControlsPositveControlGrowth: new FormControl(testData.controlsData.collectorControlsPositveControlGrowth),
         collectorControlsMediumControlGrowth: new FormControl(testData.controlsData.collectorControlsMediumControlGrowth),
         bacterialControlsUsed: new FormControl(testData.controlsData.bacterialControlsUsed),
      }),
      resultsData: new FormGroup({
         resultPositiveCompositesCount: new FormControl(testData.resultsData.resultPositiveCompositesCount),
      }),
      wrapupData: new FormGroup({
         reserveReserveSampleDisposition: new FormControl(testData.wrapupData.reserveReserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleNote: new FormControl(testData.wrapupData.reserveSampleNote),
      }),
   });
}
