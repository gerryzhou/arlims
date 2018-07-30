import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {SelEnrData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

@Component({
  selector: 'app-stage-sel-enr',
  templateUrl: './stage-sel-enr.component.html',
  styleUrls: ['./stage-sel-enr.component.scss']
})
export class StageSelEnrComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: SelEnrData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   constructor() { }

   ngOnChanges() {
   }

}
