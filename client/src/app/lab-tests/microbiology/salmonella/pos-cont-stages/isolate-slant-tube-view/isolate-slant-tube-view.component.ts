import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-isolate-slant-tube-view',
  templateUrl: './isolate-slant-tube-view.component.html',
  styleUrls: ['./isolate-slant-tube-view.component.scss']
})
export class IsolateSlantTubeViewComponent {

   @Input()
   form: FormGroup; // slant tube data form group

   constructor() { }

}
