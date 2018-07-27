import {Component, Input, OnChanges, } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-results',
  templateUrl: './stage-results.component.html',
  styleUrls: ['./stage-results.component.scss']
})
export class StageResultsComponent implements OnChanges {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnChanges() {
   }

}
