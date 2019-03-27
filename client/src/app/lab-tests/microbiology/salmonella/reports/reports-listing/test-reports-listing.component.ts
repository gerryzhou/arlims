import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {TestsService} from '../../../../../shared/services';
import {emptyTestData, TestData} from '../../test-data';
import {LabGroupTestData} from '../../../../../shared/models/lab-group-test-data';
import {SampleOpTest, AuditLogEntry} from '../../../../../../generated/dto';
import {IMP_SLM_VIDAS_PDF_REPORT_NAME, makePdfReportData} from '../pdf-report-data';

@Component({
   selector: 'app-test-reports-listing',
   templateUrl: './test-reports-listing.component.html',
   styleUrls: ['./test-reports-listing.component.scss']
})
export class TestReportsListingComponent
{
   sampleOpTest: SampleOpTest;
   testData: TestData;
   auditLogEntries: AuditLogEntry[] | null;

   constructor
      (
         private testsSvc: TestsService,
         private activatedRoute: ActivatedRoute,
      )
   {
      const labGroupTestData: LabGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      this.sampleOpTest = labGroupTestData.sampleOpTest;
      const verTestData = labGroupTestData.versionedTestData;
      this.testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.auditLogEntries = labGroupTestData.auditLogEntries || null;
   }

   generateAndPromptSavePdfReport()
   {
      const reportTestData = makePdfReportData(this.testData, this.auditLogEntries);

      const testId = this.sampleOpTest.testMetadata.testId;
      const sample = this.sampleOpTest.sampleOp;
      const sampleNum = sample.sampleTrackingNumber + '-' + sample.sampleTrackingSubNumber;
      const paf = sample.paf || '';

      this.testsSvc.getTestReportBlobForPostedTestData(testId, IMP_SLM_VIDAS_PDF_REPORT_NAME, reportTestData)
         .pipe(
            map(blob => FileSaver.saveAs(blob, `${sampleNum}_${paf}_SLM.pdf`, true))
         )
         .subscribe();
   }

}

