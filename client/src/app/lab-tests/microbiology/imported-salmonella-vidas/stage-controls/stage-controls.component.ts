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

   constructor() { }

   ngOnChanges() {
   }

}
