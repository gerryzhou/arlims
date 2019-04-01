import {Component, Input, OnChanges} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {SelEnrData} from '../../test-data';
import {EmployeeTimestamp} from '../../../../../shared/client-models/employee-timestamp';
import {LabResource} from '../../../../../../generated/dto';
import {ResourceControlAssignments} from '../../../../resource-assignments';
import {MatDialog} from '@angular/material';
import {AlertMessageService} from '../../../../../shared/services/alerts';

@Component({
   selector: 'app-stage-sel-enr',
   templateUrl: './stage-sel-enr.component.html',
   styleUrls: ['./stage-sel-enr.component.scss'],
})
export class StageSelEnrComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   allowDataChanges: boolean;

   @Input()
   conflicts: SelEnrData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   waterBaths: LabResource[];

   @Input()
   showUnsetAffordances = false;

   @Input()
   spiking: boolean | null = null;

   resourceAssignments: ResourceControlAssignments;

   positiveControlGrowthControl: AbstractControl;
   mediumControlGrowthControl: AbstractControl;
   systemControlsGrowthControl: AbstractControl;
   collectorControlsGrowthControl: AbstractControl;

   constructor(private dialogSvc: MatDialog, private alertMsgSvc: AlertMessageService) {}

   ngOnChanges()
   {
      const spikePlateCountCtrl = this.form.get('spikePlateCount');
      if ( this.spiking ) spikePlateCountCtrl.enable();
      else spikePlateCountCtrl.disable();

      this.resourceAssignments = new ResourceControlAssignments(
         this.form,
         new Map()
             .set('rvBatchId', ['RV'])
             .set('ttBatchId', ['TT'])
             .set('bgBatchId', ['BG'])
             .set('i2kiBatchId', ['I2KI'])
      );

      this.positiveControlGrowthControl = this.form.get('positiveControlGrowth');
      this.mediumControlGrowthControl = this.form.get('mediumControlGrowth');
      this.systemControlsGrowthControl = this.form.get('systemControlsGrowth');
      this.collectorControlsGrowthControl = this.form.get('collectorControlsGrowth');
      this.onSystemControlsGrowthChanged();
      this.onCollectorControlsGrowthChanged();

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

   onSystemControlsGrowthChanged()
   {
      if ( this.form.get('systemControlsGrowth').value !== 'NA' && this.form.enabled )
         this.form.get('systemControlTypes').enable();
      else
         this.form.get('systemControlTypes').disable();
   }

   onCollectorControlsGrowthChanged()
   {
      if ( this.form.get('collectorControlsGrowth').value !== 'NA' && this.form.enabled )
         this.form.get('collectorControlTypes').enable();
      else
         this.form.get('collectorControlTypes').disable();
   }

   appendSystemControlType(ctrlType: string)
   {
      const formCtrl = this.form.get('systemControlTypes');
      const origValue = formCtrl.value || '';
      const newValue = ctrlType === 'none' ? 'none' : origValue.length === 0 ? ctrlType :  origValue + ', ' + ctrlType;
      formCtrl.setValue(newValue);
   }

   appendCollectorControlType(ctrlType: string)
   {
      const formCtrl = this.form.get('collectorControlTypes');
      const origValue = formCtrl.value || '';
      const newValue = ctrlType === 'none' ? 'none' : origValue.length === 0 ? ctrlType :  origValue + ', ' + ctrlType;
      formCtrl.setValue(newValue);
   }


   promptApplyResources()
   {
      this.resourceAssignments.promptAssignResources(this.dialogSvc, this.alertMsgSvc);
   }

}
