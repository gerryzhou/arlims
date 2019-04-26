import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-isolate-slant-tube-editor',
   templateUrl: './isolate-slant-tube-editor.component.html',
   styleUrls: ['./isolate-slant-tube-editor.component.scss']
})
export class IsolateSlantTubeEditorComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   tubeType: string; // uppercase form of tube type, e.g. 'TSI' or 'LIA'.

   @Input()
   isolateDescription: string;

   @Input()
   showUnsetAffordances = false;

   slantValues: string[];
   buttValues: string[];

   constructor() { }

   ngOnChanges()
   {
      this.slantValues = this.tubeType === 'TSI' ? ['K', 'A'] : ['K', 'A', 'R'];
      this.buttValues = ['K', 'A'];
   }
}
