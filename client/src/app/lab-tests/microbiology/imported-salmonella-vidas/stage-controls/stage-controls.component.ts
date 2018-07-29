import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ControlsData} from '../test-data';

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

   constructor() { }

   ngOnChanges() {
   }

}
