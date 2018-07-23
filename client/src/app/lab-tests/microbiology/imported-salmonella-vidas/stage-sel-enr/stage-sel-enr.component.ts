import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-sel-enr',
  templateUrl: './stage-sel-enr.component.html',
  styleUrls: ['./stage-sel-enr.component.scss']
})
export class StageSelEnrComponent implements OnInit {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

}
