import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-isolate-slant-stage-view',
   templateUrl: './isolate-slant-stage-view.component.html',
   styleUrls: ['./isolate-slant-stage-view.component.scss'],
})
export class IsolateSlantStageViewComponent {

   @Input()
   form: FormGroup; // isolate test seq form group

   @Input()
   includeOxidase = true;

   constructor() { }

}
