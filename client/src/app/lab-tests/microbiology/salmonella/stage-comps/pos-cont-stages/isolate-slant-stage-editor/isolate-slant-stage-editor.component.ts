import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-isolate-slant-stage-editor',
   templateUrl: './isolate-slant-stage-editor.component.html',
   styleUrls: ['./isolate-slant-stage-editor.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsolateSlantStageEditorComponent implements OnChanges {

   @Input()
   form: FormGroup; // isolate test sequence form group

   @Input()
   allowDataChanges: boolean;

   @Input()
   includeOxidase = true;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   @Input()
   selectiveAgarDisplayName: string;

   @Input()
   showUnsetAffordances = false;

   isolateNumber: number;
   isolateDescription = '';

   constructor() { }

   ngOnChanges()
   {
      this.isolateNumber = this.form.get('isolateNumber').value;
      this.isolateDescription = 'isolate ' + this.isolateNumber + ' in ' + this.testUnitDescription + ' / ' +
         this.medium + ' / ' + this.selectiveAgarDisplayName;

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

}
