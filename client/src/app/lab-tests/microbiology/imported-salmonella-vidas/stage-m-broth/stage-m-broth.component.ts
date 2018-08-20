import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MBrothData} from '../test-data';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {LabResource} from '../../../../../generated/dto';
import * as moment from 'moment';

@Component({
   selector: 'app-stage-m-broth',
   templateUrl: './stage-m-broth.component.html',
   styleUrls: ['./stage-m-broth.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
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

   @Input()
   showUnsetAffordances = false;

   constructor() { }

   ngOnChanges() {
   }

   setStartTimeNow()
   {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.form.get('waterBathStarted').setValue(nowTime);
   }
}
