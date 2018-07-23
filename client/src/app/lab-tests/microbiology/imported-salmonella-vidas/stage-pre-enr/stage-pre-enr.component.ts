import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-pre-enr',
  templateUrl: './stage-pre-enr.component.html',
  styleUrls: ['./stage-pre-enr.component.scss']
})
export class StagePreEnrComponent implements OnInit {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

}
