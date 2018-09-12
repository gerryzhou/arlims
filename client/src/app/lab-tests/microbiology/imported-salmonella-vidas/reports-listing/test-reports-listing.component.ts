import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {emptyTestData, TestData} from '../test-data';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {TestsService} from '../../../../shared/services';

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

      this.testsSvc.getTestReportBlobForPostedTestData(testId, 'imp_slm_vidas.pdf', reportTestData)
         .pipe(
            map(blob => FileSaver.saveAs(blob, `imp slm vidas (test ${testId}).pdf`, true))
         )
         .subscribe();
   }

   makePdfReportData(): any
   {
      // TODO: Customize test data here for the report.
      return this.testData;
   }
}
