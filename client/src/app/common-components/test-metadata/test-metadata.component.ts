import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabTestMetadata} from '../../../generated/dto';
import {TestStageStatus} from '../../lab-tests/test-stages';
import {parseISODateLocal} from '../../shared/util/dates-and-times';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';

@Component({
  selector: 'app-test-metadata',
  templateUrl: './test-metadata.component.html',
  styleUrls: ['./test-metadata.component.scss']
})
export class TestMetadataComponent implements OnInit {

   @Input()
   test: LabTestMetadata;

   stageStatuses: TestStageStatus[];

   @Output()
   stageClick = new EventEmitter<LabTestStageMetadata>();

   @Output()
   testClick = new EventEmitter<LabTestMetadata>();

   constructor() { }

   ngOnInit() {
      this.stageStatuses = JSON.parse(this.test.stageStatusesJson);
   }

   onStageClicked(stageName: string) {
      this.stageClick.next(new LabTestStageMetadata(this.test, stageName));
   }

   onTestClicked() {
      this.testClick.next(this.test);
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
