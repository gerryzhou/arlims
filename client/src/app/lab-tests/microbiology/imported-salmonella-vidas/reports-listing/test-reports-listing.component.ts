import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {arrayContainsNonValue, arrayContainsValue, countValueOccurrences} from '../../../test-stages';
import {cloneDataObject} from '../../../../shared/util/data-objects';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {TestsService} from '../../../../shared/services';
import {emptyTestData, TestData} from '../test-data';

const IMP_SLM_VIDAS_REPORT_NAME = 'imp_slm_vidas.pdf';

@Component({
   selector: 'app-test-reports-listing',
   templateUrl: './test-reports-listing.component.html',
   styleUrls: ['./test-reports-listing.component.scss']
})
export class TestReportsListingComponent
{
   sampleInTest: SampleInTest;
   testData: TestData;

   constructor
      (
         private testsSvc: TestsService,
         private activatedRoute: ActivatedRoute,
      )
   {
      const labGroupTestData: LabGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      this.sampleInTest = labGroupTestData.sampleInTest;
      const verTestData = labGroupTestData.versionedTestData;
      this.testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
   }

   generateAndPromptSavePdfReport()
   {
      const reportTestData = this.makePdfReportData();

      const testId = this.sampleInTest.testMetadata.testId;

      this.testsSvc.getTestReportBlobForPostedTestData(testId, IMP_SLM_VIDAS_REPORT_NAME, reportTestData)
         .pipe(
            map(blob => FileSaver.saveAs(blob, `imp slm vidas (test ${testId}).pdf`, true))
         )
         .subscribe();
   }

   // Customize the report data specifically for the imp_slm_vidas.pdf acroforms report.
   makePdfReportData(): any
   {
      const testData = this.testData;
      if ( !testData )
         return {};

      const repData = cloneDataObject(testData) as any;

      repData.prepData.labelAttachmentType = testData.prepData.labelAttachmentType != null ?
         testData.prepData.labelAttachmentType.toLowerCase().replace('_', ' ')
         : null;

      if ( testData.preEnrData.positiveControlGrowth != null  )
      {
         repData.preEnrData.positiveControlGrowth = testData.preEnrData.positiveControlGrowth ? 'Growth' : 'No growth';
         if ( !testData.preEnrData.positiveControlGrowth ) repData.preEnrData.positiveControlGrowthWarn = '*';
      }

      if ( testData.preEnrData.mediumControlGrowth != null  )
      {
         repData.preEnrData.mediumControlGrowth = testData.preEnrData.mediumControlGrowth ? 'Growth' : 'No growth';
         if ( testData.preEnrData.mediumControlGrowth ) repData.preEnrData.mediumControlGrowthWarn = '*';
      }

      if ( testData.vidasData.positiveControlDetection != null )
      {
         repData.vidasData.positiveControlDetection = testData.vidasData.positiveControlDetection ? 'POS' : 'NEG';
         if ( !testData.vidasData.positiveControlDetection ) repData.vidasData.positiveControlDetectionWarn = '*';
      }

      if ( testData.vidasData.mediumControlDetection != null )
      {
         repData.vidasData.mediumControlDetection = testData.vidasData.mediumControlDetection ? 'POS' : 'NEG';
         if ( testData.vidasData.mediumControlDetection ) repData.vidasData.mediumControlDetectionWarn = '*';
      }

      if ( testData.vidasData.testUnitDetections != null )
      {
         repData.vidasData.compositeDetectionsList = this.makeCompositeDetectionsListText(testData.vidasData.testUnitDetections);

         const compositeDetectionsComplete =
            arrayContainsValue(testData.vidasData.testUnitDetections) &&
            !arrayContainsNonValue(testData.vidasData.testUnitDetections);

         repData.positiveCompositesCount = compositeDetectionsComplete ?
            countValueOccurrences(testData.vidasData.testUnitDetections, true)
            : null;

         if ( repData.positiveCompositesCount > 0 || !compositeDetectionsComplete )
         {
            repData.positiveCompositesCountWarn = '*';
            repData.vidasData.compositeDetectionsListWarn = '*';
         }
      }

      if ( testData.vidasData.spikeDetection != null )
      {
         repData.vidasData.spikeDetection = testData.vidasData.spikeDetection ? 'POS' : 'NEG';
         if ( !testData.vidasData.spikeDetection ) repData.vidasData.spikeDetectionWarn = '*';
      }

      if ( testData.controlsData.systemControlsGrowth != null )
      {
         repData.controlsData.systemControlsGrowth = testData.controlsData.systemControlsGrowth ? 'Growth' : 'No growth';
         if ( testData.controlsData.systemControlsGrowth ) repData.controlsData.systemControlsGrowthWarn = '*';
      }

      if ( testData.controlsData.collectorControlsGrowth != null )
      {
         repData.controlsData.collectorControlsGrowth = testData.controlsData.collectorControlsGrowth ? 'Growth' : 'No growth';
         if ( testData.controlsData.collectorControlsGrowth ) repData.controlsData.collectorControlsGrowthWarn = '*';
      }

      repData.wrapupData.reserveSampleDisposition = testData.wrapupData.reserveSampleDisposition != null ?
         testData.wrapupData.reserveSampleDisposition.toLowerCase().replace('_', ' ')
         : null;

      return repData;
   }

   private makeCompositeDetectionsListText(detections: boolean[]): string
   {
      function detValue(det: boolean | null): string
      {
         return det == null ? '' : det ? 'POS' : 'NEG';
      }
      return (
         detections
         .map((det, ix) => `Composite ${ix + 1}: ${detValue(det)}`)
         .join('\n')
      );
   }
}

