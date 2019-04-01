import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import * as moment from 'moment';

import {CreatedTestMetadata, LabTestMetadata, LabTestType, SampleOp} from '../../../generated/dto';
import {MatDialog} from '@angular/material';
import {NewTestDialogComponent} from '../new-test-dialog/new-test-dialog.component';
import {TestsService} from '../../shared/services';
import {NewTestInfo} from '../new-test-dialog/new-test-info';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {factsStatusTextFromCode} from '../../shared/client-models/sample-op-status';
import {TestClickEvent, TestStageClickEvent} from '../test-metadata/events';


@Component({
   selector: 'app-sample',
   templateUrl: './sample.component.html',
   styleUrls: ['./sample.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleComponent implements OnChanges {

   @Input()
   sampleOp: SampleOp;

   @Input()
   showAssociatedItems = false;

   @Input()
   showAssociatedItemsSummaryInSampleMetadata = false;

   @Input()
   showExtendedSampleMetadataAlways = false; // whether to show extended sample metadata even when tests & resources are not shown

   @Input()
   labGroupTestTypes: LabTestType[] = [];

   @Input()
   allowDataChanges = false;

   @Input()
   allowTestDeletion = false; // ignored if !allowDataChanges

   @Input()
   allowTestCreation = false; // "

   @Input()
   showEmployeeAssignments = false;

   @Output()
   headerClick = new EventEmitter<void>();

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

   @Output()
   testClick = new EventEmitter<TestClickEvent>();

   @Output()
   testStageClick = new EventEmitter<TestStageClickEvent>();

   @Output()
   attachedFilesClick = new EventEmitter<TestClickEvent>();

   @Output()
   testReportsClick = new EventEmitter<TestClickEvent>();

   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasAssociatedItems: boolean;

   displayFactsStatusTimestamp: string;
   factsStatusText: string;
   factsStatusCssClass: string;

   refreshedFromFacts: string;

   constructor
      (
         private testsSvc: TestsService,
         private dialogSvc: MatDialog
      )
   {}

   ngOnChanges()
   {
      this.hasExtendedSampleMetadata = !!this.sampleOp.subject;
      this.hasAssociatedItems = this.sampleOp.tests.length > 0;
      this.displayFactsStatusTimestamp =
         this.sampleOp.factsStatusTimestamp ? moment(this.sampleOp.factsStatusTimestamp).format('MMM D h:mm a')
         : '';
      this.factsStatusText = this.sampleOp.factsStatus ? factsStatusTextFromCode(this.sampleOp.factsStatus) : null;
      this.factsStatusCssClass = this.factsStatusText ? this.factsStatusText.replace(/ /g, '-').toLowerCase() : null;
      this.refreshedFromFacts =
         this.sampleOp.lastRefreshedFromFactsInstant ? moment(this.sampleOp.lastRefreshedFromFactsInstant).format('h:mm a MMM D')
         : null;
   }

   onHeaderClick()
   {
      this.headerClick.next();
   }

   onTestClicked(e: TestClickEvent)
   {
      this.testClick.emit(e);
   }

   onTestStageClicked(e: TestStageClickEvent)
   {
      this.testStageClick.emit(e);
   }

   onAttachedFilesClicked(e: TestClickEvent)
   {
      this.attachedFilesClick.emit(e);
   }

   onTestReportsClicked(e: TestClickEvent)
   {
      this.testReportsClick.emit(e);
   }

   promptCreateTest()
   {
      if ( !this.allowDataChanges )
      {
         console.error('Ignoring attempt to prompt to create new test with allowDataChanges == false');
         return;
      }

      const dlg = this.dialogSvc.open(NewTestDialogComponent, {
         width: 'calc(75%)',
         data: {
            sampleOp: this.sampleOp,
            availableTestTypes: this.labGroupTestTypes,
            selectedTestType: null,
            beginDate: moment(),
         }
      });

      dlg.afterClosed().subscribe((t: NewTestInfo) => {
         if (t)
         {
            const beginDate = t.beginDate.format('YYYY-MM-DD');
            this.testsSvc.createTest(t.sampleOp, t.selectedTestType, beginDate).subscribe(
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

   promptDeleteTest(test: LabTestMetadata)
   {
      if ( !this.allowDataChanges )
      {
         console.error('Ignoring attempt to delete test with allowDataChanges == false');
         return;
      }

      const confirmDlg = this.dialogSvc.open(ConfirmDialogComponent,
         {
            data: {
               title: 'Confirm Delete',
               message: 'Are you sure you want to delete this test?',
               confirmButtonText: 'Delete Test',
               showCancelButton: true
            },
            disableClose: false
         }
      );

      confirmDlg.afterClosed().subscribe(accepted => {
         if ( accepted )
         {
            this.testsSvc.deleteTest(test.testId).subscribe(
               () => {
                  this.testDeleted.next(test);
               },
               err => {
                  console.log(err);
                  this.testDeletionFailed.next(err);
               }
            );
         }
      });
   }
}
