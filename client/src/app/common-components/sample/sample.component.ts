import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabTestMetadata, Sample} from '../../../generated/dto';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

   @Input()
   sample: Sample;

   @Input()
   showTestsAndResources: boolean;

   @Input()
   showTestsAndResourcesToggle = true;

   @Input()
   showTestsAndResourcesSummaryInSampleMetadata = true;

   @Input()
   showExtendedSampleMetadataAlways = false; // whether to show extended sample metadata even when tests & resources are not shown

   @Output()
   requestShowTestsAndResources = new EventEmitter<boolean>();

   @Output()
   testClick = new EventEmitter<LabTestMetadata>();

   @Output()
   testStageClick = new EventEmitter<LabTestStageMetadata>();

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasTestsOrResources: boolean;

   numAssociatedResourceLists: number;

   factsStatusCssClass: string;

   constructor() { }

   ngOnInit() {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasExtendedSampleMetadata = !!this.sample.subject;
      this.hasTestsOrResources =
         this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   onTestsAndResourcesToggleRequest() {
      this.requestShowTestsAndResources.next(!this.showTestsAndResources);
   }

   onTestClicked(test: LabTestMetadata) {
      this.testClick.next(test);
   }

   onTestStageClicked(testStage: LabTestStageMetadata) {
      this.testStageClick.next(testStage);
   }

}
