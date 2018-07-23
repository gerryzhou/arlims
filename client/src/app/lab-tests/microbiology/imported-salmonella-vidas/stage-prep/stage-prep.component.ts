import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-prep',
  templateUrl: './stage-prep.component.html',
  styleUrls: ['./stage-prep.component.scss']
})
export class StagePrepComponent implements OnInit {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

}
