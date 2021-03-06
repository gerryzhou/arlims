import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';

import * as moment from 'moment';

import {AlertMessageService} from '../../../../../shared/services/alerts';
import {LabResource} from '../../../../../../generated/dto';
import {ResourceControlAssignmentsManager} from '../../../../resource-control-assignments-manager';

@Component({
   selector: 'app-stage-m-broth',
   templateUrl: './stage-m-broth.component.html',
   styleUrls: ['./stage-m-broth.component.scss'],
})
export class StageMBrothComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   allowDataChanges: boolean;

   @Input()
   waterBaths: LabResource[];

   @Input()
   showUnsetAffordances = false;

   resourceAssignments: ResourceControlAssignmentsManager;

   constructor(private dialogSvc: MatDialog, private alertMsgSvc: AlertMessageService) {}

   ngOnChanges()
   {
      this.resourceAssignments = new ResourceControlAssignmentsManager(
         this.form,
         new Map()
            .set('mBrothBatchId', ['MB']),
         ','
      );

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

   setStartTimeNow()
   {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.form.get('waterBathStarted').setValue(nowTime);
   }

   promptApplyResources()
   {
      this.resourceAssignments.promptAssignResources(this.dialogSvc, this.alertMsgSvc);
   }

   onWaterbathSelected()
   {
      if ( !this.form.get('waterBathStarted').value )
         this.setStartTimeNow();
   }
}
