import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ControlsData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

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

   showUnsetAffordances = false;

   constructor() { }

   ngOnChanges() {
   }

   appendSystemControlType(ctrlType: string)
   {
      const formCtrl = this.form.get('systemControlTypes');
      const origValue = formCtrl.value || '';
      const newValue = origValue.length === 0 ? ctrlType :  origValue + ', ' + ctrlType;
      formCtrl.setValue(newValue);
   }

   appendCollectorControlType(ctrlType: string)
   {
      const formCtrl = this.form.get('collectorControlTypes');
      const origValue = formCtrl.value || '';
      const newValue = origValue.length === 0 ? ctrlType :  origValue + ', ' + ctrlType;
      formCtrl.setValue(newValue);
   }
}
