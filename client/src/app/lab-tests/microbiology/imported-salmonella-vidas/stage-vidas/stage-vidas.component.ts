import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-stage-vidas',
  templateUrl: './stage-vidas.component.html',
  styleUrls: ['./stage-vidas.component.scss']
})
export class StageVidasComponent implements OnInit {

   @Input()
   form: FormGroup;

   constructor() { }

   ngOnInit() {
   }

}
