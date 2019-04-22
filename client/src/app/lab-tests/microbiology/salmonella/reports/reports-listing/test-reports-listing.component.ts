import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import * as FileSaver from 'file-saver';

import {TestsService} from '../../../../../shared/services';
import {emptyTestData, TestData} from '../../test-data';
import {LabGroupTestData} from '../../../../../shared/client-models/lab-group-test-data';
import {SampleOpTest, AuditLogEntry} from '../../../../../../generated/dto';
import {IMP_SLM_VIDAS_PDF_REPORT_NAME, makePdfReportData} from '../pdf-report-data';
import {AppInternalUrlsService} from '../../../../../shared/services/app-internal-urls.service';

@Component({
   selector: 'app-test-reports-listing',
   templateUrl: './test-reports-listing.component.html',
   styleUrls: ['./test-reports-listing.component.scss']
})
export class TestReportsListingComponent
{
   readonly labGroupTestData: LabGroupTestData;
   readonly exitRouterPath: any[];

   readonly sampleOpTest: SampleOpTest;
   readonly testData: TestData;
   readonly auditLogEntries: AuditLogEntry[] | null;

   constructor
      (
         private testsSvc: TestsService,
         private appUrls: AppInternalUrlsService,
         private router: Router,
         private activatedRoute: ActivatedRoute,
         private appUrlsSvc: AppInternalUrlsService,
      )
   {
      const exitRouterPathParam = activatedRoute.snapshot.queryParams['exitRouterPath'];
      this.exitRouterPath =  exitRouterPathParam ? [exitRouterPathParam] : appUrlsSvc.home();
      this.labGroupTestData = activatedRoute.snapshot.data['labGroupTestData'];
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

   onFormDataReviewReportClicked()
   {
      const testId = this.sampleOpTest.testMetadata.testId;
      const lgcScope = this.labGroupTestData.labGroupContentsScope;

      const nav = this.appUrlsSvc.testReport('MICRO_SLM', testId, 'form-data-review', lgcScope);

      this.router.navigate(nav.path, { queryParams: nav.queryParams });
   }
}

