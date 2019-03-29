import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

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
   allowDataChanges: boolean;

   constructor() { }

   ngOnChanges()
   {
      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

   onMethodChanged(changeEvent: any)
   {
      // Could store identification method in member for method-dependent rendering here.
   }
}
