import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {LabTestMetadata, LabTestType, Sample} from '../../../generated/dto';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';
import {MatDialog} from '@angular/material';
import {NewTestDialogComponent} from '../new-test-dialog/new-test-dialog.component';

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
   newTestTypeChoices: LabTestType[] = [];

   @Output()
   headerClick = new EventEmitter<void>();

   @Output()
   testClick = new EventEmitter<LabTestMetadata>();

   @Output()
   testStageClick = new EventEmitter<LabTestStageMetadata>();

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasAssociatedItems: boolean;

   numAssociatedResourceLists: number;

   factsStatusCssClass: string;

   constructor(private dialogSvc: MatDialog) { }

   ngOnChanges() {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasExtendedSampleMetadata = !!this.sample.subject;
      this.hasAssociatedItems = this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   onHeaderClick() {
      this.headerClick.next();
   }

   onTestClicked(test: LabTestMetadata) {
      this.testClick.next(test);
   }

   onTestStageClicked(testStage: LabTestStageMetadata) {
      this.testStageClick.next(testStage);
   }

   promptCreateNewTest() {
      const dlg = this.dialogSvc.open(NewTestDialogComponent, {
         width: 'calc(75%)',
         data: {
            sample: this.sample,
            availableTestTypes: this.newTestTypeChoices,
            selectedTestType: null,
            beginDate: null,
         }
      });

      dlg.afterClosed().subscribe(result => {
         console.log('The dialog was closed with result:');
         console.log(result);
         // TODO: Create the new test.  Get the date part by formatting Date object with date-only format in current timezone.
      });
   }


}
