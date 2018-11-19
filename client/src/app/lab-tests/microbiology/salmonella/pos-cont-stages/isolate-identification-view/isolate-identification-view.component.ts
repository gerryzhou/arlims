import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-isolate-identification-view',
   templateUrl: './isolate-identification-view.component.html',
   styleUrls: ['./isolate-identification-view.component.scss']
})
export class IsolateIdentificationViewComponent {

   @Input()
   form: FormGroup;

   constructor() { }

}
