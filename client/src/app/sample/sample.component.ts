import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../generated/dto';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

   @Input()
   sample: Sample;

   constructor() { }

   ngOnInit() {
   }

}
