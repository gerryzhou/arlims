import {Component, Input, OnInit} from '@angular/core';
import {LabTestMetadata} from '../../../../generated/dto';
import {TestStageStatus} from '../../../lab-tests/test-stage-status';

@Component({
  selector: 'app-test-metadata',
  templateUrl: './test-metadata.component.html',
  styleUrls: ['./test-metadata.component.scss']
})
export class TestMetadataComponent implements OnInit {

   @Input()
   test: LabTestMetadata;

   @Input()
   showSampleAttributes = false;

   stageStatuses: TestStageStatus[];

   constructor() { }

   ngOnInit() {
      this.stageStatuses = JSON.parse(this.test.stageStatusesJson);
   }

   testDayNumber(): number | null {
      if ( !this.test.beginDate ) {
         return null;
      }
      const millis_per_day = 1000 * 60 * 60 * 24;
      return Math.round((new Date().getDate() - this.test.beginDate.getDate()) / millis_per_day) + 1;
   }
}
