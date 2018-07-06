import {Component, Input, OnInit} from '@angular/core';
import {LabTestMetadata} from '../../../../generated/dto';
import {TestStageStatus} from '../../../lab-tests/test-stage-status';
import {parseISODateLocal} from '../../util/dates-and-times';

@Component({
  selector: 'app-test-metadata',
  templateUrl: './test-metadata.component.html',
  styleUrls: ['./test-metadata.component.scss']
})
export class TestMetadataComponent implements OnInit {

   @Input()
   test: LabTestMetadata;

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
      // Convert beginning of day for the date string interpreted in local timezone to UTC instant (js Date).
      const beginDate = parseISODateLocal(this.test.beginDate);
      const now = new Date().getTime(); // now as UTC instant
      return Math.round((now - beginDate.getTime()) / millis_per_day) + 1;
   }
}
