import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {LabResource} from '../../../../../generated/dto';
import {PreEnrData} from '../test-data';

@Component({
  selector: 'app-stage-pre-enr',
  templateUrl: './stage-pre-enr.component.html',
  styleUrls: ['./stage-pre-enr.component.scss']
})
export class StagePreEnrComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: PreEnrData;

   @Input()
   balances: LabResource[];

   @Input()
   incubators: LabResource[];

   constructor() { }

   ngOnChanges() {
   }

}
