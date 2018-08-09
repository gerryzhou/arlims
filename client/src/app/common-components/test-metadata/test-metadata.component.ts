import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {LabTestMetadata, LabTestType} from '../../../generated/dto';
import {TestStageStatus} from '../../lab-tests/test-stages';
import {LabTestStageMetadata} from '../../shared/models/lab-test-stage-metadata';

@Component({
  selector: 'app-test-metadata',
  templateUrl: './test-metadata.component.html',
  styleUrls: ['./test-metadata.component.scss']
})
export class TestMetadataComponent implements OnChanges {

   @Input()
   test: LabTestMetadata;

   @Input()
   labGroupTestTypes: LabTestType[] = [];

   testType: LabTestType;

   stageStatuses: TestStageStatus[];

   testStatusActions: TestStatusAction[];

   @Output()
   stageClick = new EventEmitter<LabTestStageMetadata>();

   @Output()
   testClick = new EventEmitter<LabTestMetadata>();

   @Output()
   reportClick = new EventEmitter<string>();

   constructor() { }

   ngOnChanges() {
      this.stageStatuses = JSON.parse(this.test.stageStatusesJson);
      this.testStatusActions = TestMetadataComponent.makeTestStatusActionsTimeDescending(this.test);

      this.testType = this.labGroupTestTypes.find(tt => tt.code === this.test.testTypeCode);
   }

   onStageClicked(stageName: string) {
      this.stageClick.next(new LabTestStageMetadata(this.test, stageName));
   }

   onTestClicked() {
      this.testClick.next(this.test);
   }

   onReportClicked(reportName: string)
   {
      this.reportClick.next(reportName);
   }

   private static makeTestStatusActionsTimeDescending(test: LabTestMetadata): TestStatusAction[] {
      const actions: TestStatusAction[] = [];

      if (test.lastSavedInstant) {
         actions.push({
            action: 'Saved',
            timestamp: test.lastSavedInstant,
            employeeShortName: test.lastSavedByEmpShortName,
         });
      }
      if (test.savedToFactsInstant) {
         actions.push({
            action: 'Synced to FACTS',
            timestamp: test.savedToFactsInstant,
            employeeShortName: test.savedToFactsByEmpShortName
         });
      }
      if (test.reviewedInstant) {
         actions.push({
            action: 'Reviewed',
            timestamp: test.reviewedInstant,
            employeeShortName: test.reviewedByEmpShortName
         });
      }

      actions.sort((a: TestStatusAction, b: TestStatusAction) =>
         a.timestamp < b.timestamp ? -1 :
         a.timestamp > b.timestamp ? 1 :
         0
      );

      return actions;
   }
}

// Save, review, sync actions.
interface TestStatusAction {
   action: string;
   timestamp: string;
   employeeShortName: string;
}
