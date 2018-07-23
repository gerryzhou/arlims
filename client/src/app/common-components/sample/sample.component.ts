import {Component, Input, OnInit} from '@angular/core';
import {LabTestMetadata, Sample} from '../../../generated/dto';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';
import {Router} from '@angular/router';

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
   allowTogglingTestsAndResources = true;

   @Input()
   showTestsAndResourcesSummaryInSampleMetadata = true;

   @Input()
   showExtendedSampleMetadataAlways = false; // whether to show extended sample metadata even when tests & resources are not shown

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasExtendedSampleMetadata: boolean; // whether sample metadata needs a second row
   hasTestsOrResources: boolean;

   numAssociatedResourceLists: number;

   factsStatusCssClass: string;

   constructor(private router: Router) { }

   ngOnInit() {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasExtendedSampleMetadata = !!this.sample.subject;
      this.hasTestsOrResources =
         this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   toggleTestsAndResources() {
      this.showTestsAndResources = !this.showTestsAndResources;
   }

   navigateToTest(test: LabTestMetadata) {
      this.router.navigate(['test-data', test.testTypeCode, test.testId]);
   }

   navigateToTestStage(testStage: LabTestStageMetadata) {
      const test = testStage.labTestMetadata;
      this.router.navigate(['test-data', test.testTypeCode, test.testId, testStage.stageName]);
   }
}
