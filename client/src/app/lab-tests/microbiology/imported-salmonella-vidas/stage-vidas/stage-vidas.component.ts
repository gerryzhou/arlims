import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {VidasData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

@Component({
  selector: 'app-stage-vidas',
  templateUrl: './stage-vidas.component.html',
  styleUrls: ['./stage-vidas.component.scss']
})
export class StageVidasComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: VidasData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   constructor() { }

   ngOnChanges() {
   }

}
