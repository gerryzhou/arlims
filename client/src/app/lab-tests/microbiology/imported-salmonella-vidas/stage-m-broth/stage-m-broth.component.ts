import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MBrothData} from '../test-data';

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

   constructor() { }

   ngOnChanges() {
   }

}
