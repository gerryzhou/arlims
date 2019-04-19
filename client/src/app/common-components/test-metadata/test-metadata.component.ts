import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {LabTestMetadata, LabTestType, SampleOp, SampleOpTest} from '../../../generated/dto';
import {TestStageStatus} from '../../lab-tests/test-stages';
import {Router} from '@angular/router';
import {TestClickEvent, TestStageClickEvent} from './events';

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
   sampleOp: SampleOp;

   @Input()
   allowDataChanges = false;

   @Input()
   labGroupTestTypes: LabTestType[] = [];

   @Output()
   testClick = new EventEmitter<TestClickEvent>();

   @Output()
   testStageClick = new EventEmitter<TestStageClickEvent>();

   @Output()
   attachedFilesClick = new EventEmitter<TestClickEvent>();

   @Output()
   reportsClick = new EventEmitter<TestClickEvent>();

   testType: LabTestType;

   stageStatuses: TestStageStatus[];

   testStatusActions: TestStatusAction[];

   constructor
      (
         public router: Router,
      )
   {}

   ngOnChanges()
   {
      this.stageStatuses = JSON.parse(this.test.stageStatusesJson);
      this.testStatusActions = makeTestStatusActionsTimeDescending(this.test);

      this.testType = this.labGroupTestTypes.find(tt => tt.code === this.test.testTypeCode);
   }

   onTypeClicked()
   {
      this.testClick.emit({
         sampleOpTest: { sampleOp: this.sampleOp, testMetadata: this.test }
      });
   }

   onStageClicked(stageName: string)
   {
      this.testStageClick.emit({
         sampleOpTest: { sampleOp: this.sampleOp, testMetadata: this.test },
         stageName
      });
   }

   onAttachedFilesClicked()
   {
      this.attachedFilesClick.emit({
         sampleOpTest: { sampleOp: this.sampleOp, testMetadata: this.test }
      });
   }

   onReportsClicked()
   {
      this.reportsClick.emit({
         sampleOpTest: { sampleOp: this.sampleOp, testMetadata: this.test }
      });
   }

}


// Save, review, sync actions.
interface TestStatusAction {
   action: string;
   timestamp: string;
   employeeShortName: string;
}

function makeTestStatusActionsTimeDescending(test: LabTestMetadata): TestStatusAction[]
{
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

