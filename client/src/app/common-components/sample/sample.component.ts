import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import * as moment from 'moment';

import {CreatedTestMetadata, LabTestMetadata, LabTestType, Sample} from '../../../generated/dto';
import {MatDialog} from '@angular/material';
import {NewTestDialogComponent} from '../new-test-dialog/new-test-dialog.component';
import {TestsService} from '../../shared/services';
import {NewTestInfo} from '../new-test-dialog/new-test-info';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';


@Component({
   selector: 'app-sample',
   templateUrl: './sample.component.html',
   styleUrls: ['./sample.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
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
   testCreated = new EventEmitter<CreatedTestMetadata>();

   @Output()
   testCreationFailed = new EventEmitter<string>();

   @Output()
   testDeleted = new EventEmitter<LabTestMetadata>();

   @Output()
   testDeleteFailed = new EventEmitter<string>();

   @Output()
   testDeletionFailed = new EventEmitter<string>();

   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasAssociatedItems: boolean;

   numAssociatedResourceLists: number;

   displayFactsStatusTimestamp: string;
   factsStatusText: string;
   factsStatusCssClass: string;

   constructor(private testsSvc: TestsService,
               private dialogSvc: MatDialog) {}

   ngOnChanges()
   {
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasExtendedSampleMetadata = !!this.sample.subject;
      this.hasAssociatedItems = this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
      this.displayFactsStatusTimestamp =
         this.sample.factsStatusTimestamp ? moment(this.sample.factsStatusTimestamp).format(' MMM D h:mm a')
         : '';
      this.factsStatusText = this.factsStatusTextFromCode(this.sample.factsStatus);
      this.factsStatusCssClass = this.factsStatusText.replace(/ /g, '-').toLowerCase();
   }

   onHeaderClick()
   {
      this.headerClick.next();
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

   private factsStatusTextFromCode(factsStatus: string)
   {
      // TODO: Verify and complete this status code => status text mappings.
      switch (factsStatus)
      {
         case 'A': return 'Accepted';
         case 'S': return 'Assigned';
         case 'I': return 'In Progress';
         case 'O': return 'Original Complete';
         default: return factsStatus;
      }
   }
}
