import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {LabTestMetadata, Sample} from '../../../generated/dto';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnChanges {

   @Input()
   sample: Sample;

   @Input()
   showAssociatedItems: boolean;

   @Input()
   showAssociatedItemsToggle = true;

   @Input()
   showAssociatedItemsSummaryInSampleMetadata = true;

   @Input()
   showExtendedSampleMetadataAlways = false; // whether to show extended sample metadata even when tests & resources are not shown

   @Output()
   toggleAssociatedItems = new EventEmitter<boolean>();

   @Output()
   testClick = new EventEmitter<LabTestMetadata>();

   @Output()
   testStageClick = new EventEmitter<LabTestStageMetadata>();

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasAssociatedItems: boolean;

   numAssociatedResourceLists: number;

   factsStatusCssClass: string;

   constructor() { }

   ngOnChanges() {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasExtendedSampleMetadata = !!this.sample.subject;
      this.hasAssociatedItems =
         this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   onAssociatedItemsToggleRequest() {
      this.toggleAssociatedItems.next(!this.showAssociatedItems);
   }

   onTestClicked(test: LabTestMetadata) {
      this.testClick.next(test);
   }

   onTestStageClicked(testStage: LabTestStageMetadata) {
      this.testStageClick.next(testStage);
   }

}
