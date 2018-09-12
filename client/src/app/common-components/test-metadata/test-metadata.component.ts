import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {LabTestMetadata, LabTestType} from '../../../generated/dto';
import {TestStageStatus} from '../../lab-tests/test-stages';
import {AppInternalUrlsService} from '../../shared/services/app-internal-urls.service';
import {Router} from '@angular/router';

@Component({
   selector: 'app-test-metadata',
   templateUrl: './test-metadata.component.html',
   styleUrls: ['./test-metadata.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestMetadataComponent implements OnChanges {

   @Input()
   test: LabTestMetadata;

   @Input()
   labGroupTestTypes: LabTestType[] = [];

   testType: LabTestType;

   stageStatuses: TestStageStatus[];

   testStatusActions: TestStatusAction[];

   constructor
      (
         public appUrlsSvc: AppInternalUrlsService,
         public router: Router,
      )
   {}

   ngOnChanges()
   {
      this.stageStatuses = JSON.parse(this.test.stageStatusesJson);
      this.testStatusActions = TestMetadataComponent.makeTestStatusActionsTimeDescending(this.test);

      this.testType = this.labGroupTestTypes.find(tt => tt.code === this.test.testTypeCode);
   }

   onEditStageClicked(stageName: string)
   {
      const url = this.appUrlsSvc.testStageDataEntry(this.test.testTypeCode, this.test.testId, stageName);
      this.router.navigate(url);
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
