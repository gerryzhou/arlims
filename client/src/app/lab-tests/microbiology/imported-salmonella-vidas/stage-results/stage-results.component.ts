import {Component, Input, OnChanges, } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ResultsData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';

@Component({
  selector: 'app-stage-results',
  templateUrl: './stage-results.component.html',
  styleUrls: ['./stage-results.component.scss']
})
export class StageResultsComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: ResultsData;

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   @Input()
   showUnsetAffordances = false;

   constructor() {}

   ngOnChanges() {}

}
