import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SelEnrData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {LabResource} from '../../../../../generated/dto';
import {ResourceControlAssignments} from '../../../resource-assignments';
import {MatDialog} from '@angular/material';
import {AlertMessageService} from '../../../../shared/services/alerts';

@Component({
   selector: 'app-stage-sel-enr',
   templateUrl: './stage-sel-enr.component.html',
   styleUrls: ['./stage-sel-enr.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageSelEnrComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: SelEnrData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   waterBaths: LabResource[];

   @Input()
   showUnsetAffordances = false;

   resourceAssignments: ResourceControlAssignments;

   constructor(private dialogSvc: MatDialog, private alertMsgSvc: AlertMessageService) {}

   ngOnChanges()
   {
      this.resourceAssignments = new ResourceControlAssignments(
         this.form,
         new Map()
             .set('rvBatchId', ['RV'])
             .set('ttBatchId', ['TT'])
             .set('bgBatchId', ['BG'])
             .set('i2kiBatchId', ['I2KI'])
      );
   }

   promptApplyResources()
   {
      this.resourceAssignments.promptAssignResources(this.dialogSvc, this.alertMsgSvc);
   }

}
