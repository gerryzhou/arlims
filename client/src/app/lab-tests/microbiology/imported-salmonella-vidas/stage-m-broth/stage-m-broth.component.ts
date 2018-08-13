import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MBrothData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {LabResource} from '../../../../../generated/dto';
import * as moment from 'moment';

@Component({
  selector: 'app-stage-m-broth',
  templateUrl: './stage-m-broth.component.html',
  styleUrls: ['./stage-m-broth.component.scss']
})
export class StageMBrothComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: MBrothData;

   @Input()
   waterBaths: LabResource[];

   @Input()
   conflictsWhoWhen: EmployeeTimestamp;

   constructor() { }

   ngOnChanges() {
   }

   setStartTimeNow()
   {
      const nowTime = moment().format('HH:mm');
      this.form.get('mBrothStartTime').setValue(nowTime);
   }
}
