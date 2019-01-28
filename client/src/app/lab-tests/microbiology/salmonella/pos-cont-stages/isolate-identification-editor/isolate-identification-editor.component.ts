import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {IdentificationMethod} from '../../test-data';

@Component({
   selector: 'app-isolate-identification-editor',
   templateUrl: './isolate-identification-editor.component.html',
   styleUrls: ['./isolate-identification-editor.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsolateIdentificationEditorComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   viewOnly = false;

   constructor() { }

   ngOnChanges()
   {
   }

   onMethodChanged(changeEvent: any)
   {
      // Could store identification method in member for method-dependent rendering here.
   }
}
