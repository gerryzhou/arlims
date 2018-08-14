import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PrepData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

@Component({
  selector: 'app-stage-prep',
  templateUrl: './stage-prep.component.html',
  styleUrls: ['./stage-prep.component.scss']
})
export class StagePrepComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: PrepData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   constructor() {}

   ngOnChanges() {}
}
