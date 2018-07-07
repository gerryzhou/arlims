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

   hasTestsOrResources: boolean;
   numAssociatedResourceLists: number;

   @Input()
   showTestsAndResources: boolean;

   factsStatusCssClass: string;

   constructor() { }

   ngOnInit() {
      this.factsStatusCssClass = this.sample.factsStatus.replace(/ /g, '-').toLowerCase();
      this.numAssociatedResourceLists =
         this.sample.associatedManagedResourceLists.length +
         this.sample.associatedUnmanagedResourceLists.length;
      this.hasTestsOrResources =
         this.sample.tests.length > 0 || this.numAssociatedResourceLists > 0;
   }

   toggleTestsAndResources() {
      this.showTestsAndResources = !this.showTestsAndResources;
   }
}
