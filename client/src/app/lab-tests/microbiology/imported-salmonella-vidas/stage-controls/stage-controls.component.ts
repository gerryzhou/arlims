import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ControlsData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {MatCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-stage-controls',
  templateUrl: './stage-controls.component.html',
  styleUrls: ['./stage-controls.component.scss']
})
export class StageControlsComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: ControlsData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   constructor() { }

   ngOnChanges()
   {
      this.onSystemControlsUsedChanged();
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

   onSystemControlsUsedChanged()
   {
      if (this.form.get('systemControlsUsed').value)
      {
         this.form.get('systemControlTypes').enable();
         this.form.get('systemControlsGrowth').enable();
      }
      else
      {
         this.form.get('systemControlTypes').disable();
         this.form.get('systemControlsGrowth').disable();
      }
   }

   onCollectorControlsUsedChanged()
   {
      if (this.form.get('collectorControlsUsed').value)
      {
         this.form.get('collectorControlTypes').enable();
         this.form.get('collectorControlsGrowth').enable();
      }
      else
      {
         this.form.get('collectorControlTypes').disable();
         this.form.get('collectorControlsGrowth').disable();
      }
   }
}
