import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-prep',
  templateUrl: './stage-prep.component.html',
  styleUrls: ['./stage-prep.component.scss']
})
export class StagePrepComponent implements OnChanges {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnChanges() {
   }
}
