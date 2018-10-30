import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-slant-tube-test',
   templateUrl: './slant-tube-test.component.html',
   styleUrls: ['./slant-tube-test.component.scss']
})
export class SlantTubeTestComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   tubeType: string; // uppercase form of tube type, e.g. 'TSI' or 'LIA'.

   @Input()
   isolateDescription: string;

   slantValues: string[];
   buttValues: string[];

   slantValueCssClass: string;
   buttValueCssClass: string;

   constructor() { }

   ngOnChanges()
   {
      this.slantValues = this.tubeType === 'TSI' ? ['K', 'A'] : ['K', 'A', 'R'];
      this.buttValues = ['K', 'A'];
      this.onSlantChanged(this.form.get('slant').value);
      this.onButtChanged(this.form.get('butt').value);
   }

   onSlantChanged(newValue: string)
   {
      this.slantValueCssClass = (this.tubeType || 'any') + '-' + newValue;
   }

   onButtChanged(newValue: string)
   {
      this.buttValueCssClass = (this.tubeType || 'any') + '-' + newValue;
   }
}
