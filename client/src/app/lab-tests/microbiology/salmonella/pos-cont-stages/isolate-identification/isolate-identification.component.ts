import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-isolate-identification',
   templateUrl: './isolate-identification.component.html',
   styleUrls: ['./isolate-identification.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsolateIdentificationComponent implements OnChanges {

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
      // TODO: Maybe store ident method as basis for method-dependent rendering in the view (helper button for API for example).
      console.log('onMethodChanged', changeEvent);
   }
}
