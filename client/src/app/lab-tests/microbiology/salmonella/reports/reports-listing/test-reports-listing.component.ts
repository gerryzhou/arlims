import {Component} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {TestsService} from '../../../../../shared/services';
import {emptyTestData, TestData} from '../../test-data';
import {LabGroupTestData} from '../../../../../shared/client-models/lab-group-test-data';
import {SampleOpTest, AuditLogEntry} from '../../../../../../generated/dto';
import {IMP_SLM_VIDAS_PDF_REPORT_NAME, makePdfReportData} from '../pdf-report-data';

@Component({
   selector: 'app-test-reports-listing',
   templateUrl: './test-reports-listing.component.html',
   styleUrls: ['./test-reports-listing.component.scss']
})
export class TestReportsListingComponent
{
   labGroupTestData: LabGroupTestData;
   sampleOpTest: SampleOpTest;
   testData: TestData;
   auditLogEntries: AuditLogEntry[] | null;

   constructor
      (
         private testsSvc: TestsService,
         private router: Router,
         private activatedRoute: ActivatedRoute,
      )
   {
      this.labGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      this.sampleOpTest = this.labGroupTestData.sampleOpTest;
      const verTestData = this.labGroupTestData.versionedTestData;
      this.testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.auditLogEntries = this.labGroupTestData.auditLogEntries || null;
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

   // TODO: Decide how to handle passing data to this report (through service or through navigation extras).
   //       Trying to use navigation extras currently yields error within Angular regarding illegal pushState value.
   // onFormDataReviewReportClicked()
   // {
   //    const navData = this.makeNavigationData({ labGroupTestData: this.labGroupTestData });
   //
   //    const testId = this.sampleOpTest.testMetadata.testId;
   //
   //    this.router.navigate(
   //       // TODO: Maybe call injected app internal urls service with test-type to build absolute url.
   //       ['test-types/micro-slm/reports/form-data-review', testId],
   //       // navData
   //    );
   // }

}

