import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {WrapupData} from '../test-data';

@Component({
  selector: 'app-stage-wrapup',
  templateUrl: './stage-wrapup.component.html',
  styleUrls: ['./stage-wrapup.component.scss']
})
export class StageWrapupComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   conflicts: WrapupData;

   constructor() { }

   ngOnChanges() {
   }

}
