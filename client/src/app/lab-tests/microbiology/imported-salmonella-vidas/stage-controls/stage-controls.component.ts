import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-controls',
  templateUrl: './stage-controls.component.html',
  styleUrls: ['./stage-controls.component.scss']
})
export class StageControlsComponent implements OnInit {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

}
