import {Component, Input, OnInit} from '@angular/core';
import {LabTestMetadata, Sample} from '../../generated/dto';
import {LabTestStageMetadata} from '../shared/models/lab-test-stage-metadata';
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
   showSampleDetails: boolean;

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasAdditionalSampleMetadata: boolean; // whether sample metadata needs a second row
   hasTestsOrResources: boolean;

   numAssociatedResourceLists: number;

   factsStatusCssClass: string;

   constructor(private router: Router) { }

   ngOnInit() {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasAdditionalSampleMetadata = !!this.sample.subject;
      this.hasTestsOrResources =
         this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   toggleTestsAndResources() {
      this.showSampleDetails = !this.showSampleDetails;
   }

   navigateToTest(test: LabTestMetadata) {
      this.router.navigate(['test-data', test.testTypeCode, test.testId]);
   }

   navigateToTestStage(testStage: LabTestStageMetadata) {
      this.router.navigate(['test-data', testStage.labTestMetadata.testTypeCode, testStage.labTestMetadata.testId]);
   }
}
