import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CreatedTestMetadata, LabTestMetadata, LabTestType, Sample} from '../../../generated/dto';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';
import {MatDialog} from '@angular/material';
import {NewTestDialogComponent} from '../new-test-dialog/new-test-dialog.component';
import {TestsService} from '../../shared/services';
import {NewTestInfo} from '../new-test-dialog/new-test-info';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnChanges {

   @Input()
   sample: Sample;

   @Input()
   showAssociatedItems = false;

   @Input()
   showAssociatedItemsSummaryInSampleMetadata = false;

   @Input()
   showExtendedSampleMetadataAlways = false; // whether to show extended sample metadata even when tests & resources are not shown

   @Input()
   labGroupTestTypes: LabTestType[] = [];

   @Input()
   showTestDeleteButtons = true;

   @Output()
   headerClick = new EventEmitter<void>();

   @Output()
   testClick = new EventEmitter<LabTestMetadata>();

   @Output()
   testStageClick = new EventEmitter<LabTestStageMetadata>();

   @Output()
   testReportClick = new EventEmitter<[number, string]>();

   @Output()
   testCreated = new EventEmitter<CreatedTestMetadata>();

   @Output()
   testCreationFailed = new EventEmitter<string>();

   @Output()
   testDeleted = new EventEmitter<LabTestMetadata>();

   @Output()
   testDeleteFailed = new EventEmitter<string>();

   @Output()
   testDeletionFailed = new EventEmitter<string>();

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasAssociatedItems: boolean;

   numAssociatedResourceLists: number;

   factsStatusCssClass: string;

   constructor(private testsSvc: TestsService,
               private dialogSvc: MatDialog) {}

   ngOnChanges()
   {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasExtendedSampleMetadata = !!this.sample.subject;
      this.hasAssociatedItems = this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   onHeaderClick()
   {
      this.headerClick.next();
   }

   onTestClicked(test: LabTestMetadata)
   {
      this.testClick.next(test);
   }

   onTestStageClicked(testStage: LabTestStageMetadata)
   {
      this.testStageClick.next(testStage);
   }

   onTestReportClicked(testId: number, reportName: string)
   {
      this.testReportClick.next([testId, reportName]);
   }

   promptCreateNewTest()
   {
      const dlg = this.dialogSvc.open(NewTestDialogComponent, {
         width: 'calc(75%)',
         data: {
            sample: this.sample,
            availableTestTypes: this.labGroupTestTypes,
            selectedTestType: null,
            beginDate: null,
         }
      });

      dlg.afterClosed().subscribe((t: NewTestInfo) => {
         if (t)
         {
            const beginDate = t.beginDate.format('YYYY-MM-DD');
            this.testsSvc.createTest(t.sample.id, t.selectedTestType, beginDate).subscribe(
               createdTestMd => {
                  this.testCreated.next(createdTestMd);
               },
               err => {
                  this.testCreationFailed.next(err);
               }
            );
         }
      });
   }

   onDeleteTestClicked(test: LabTestMetadata)
   {
      const confirmDlg = this.dialogSvc.open(ConfirmDialogComponent,
         {
            data: {
               titleSubject: 'Delete',
               confirmMessage: 'Are you sure you want to delete this test?',
            },
            disableClose: false
         }
      );

      confirmDlg.afterClosed().subscribe(accepted => {
         if (accepted)
         {
            this.testsSvc.deleteTest(test.testId).subscribe(
               () => {
                  this.testDeleted.next(test);
               },
               err => {
                  this.testDeleteFailed.next(err);
               }
            );
         }
      });
   }
}
