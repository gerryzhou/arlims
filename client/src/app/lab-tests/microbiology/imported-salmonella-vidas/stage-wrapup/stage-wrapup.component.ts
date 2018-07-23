import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-wrapup',
  templateUrl: './stage-wrapup.component.html',
  styleUrls: ['./stage-wrapup.component.scss']
})
export class StageWrapupComponent implements OnInit {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

}
