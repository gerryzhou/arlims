import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../generated/dto';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

   @Input()
   sample: Sample;

   // Sample "details" include tests or resource lists, and additional sample metadata.
   hasAdditionalSampleMetadata: boolean; // whether sample metadata needs a second row
   hasTestsOrResources: boolean;

   numAssociatedResourceLists: number;

   @Input()
   showSampleDetails: boolean;

   factsStatusCssClass: string;

   constructor() { }

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
}
