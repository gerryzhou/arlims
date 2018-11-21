import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppUser} from '../../../../../../generated/dto';

@Component({
   selector: 'app-one-pos-test-unit-cont-tests',
   templateUrl: './one-pos-test-unit-cont-tests.component.html',
   styleUrls: ['./one-pos-test-unit-cont-tests.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnePosTestUnitContTestsComponent implements OnChanges {

   @Input()
   stage: 'SLANT' | 'IDENT';

   @Input()
   showOtherStageDataAsContext;

   @Input()
   viewOnly = false;

   @Input()
   form: FormGroup;

   @Input()
   testUnitNumber: number;

   @Input()
   sampleTestUnitsTypeAbrev: string;

   @Input()
   showDisposeButton = false;

   @Input()
   appUser: AppUser;

   @Input()
   showUnsetAffordances = false;

   @Output()
   disposeRequested = new EventEmitter<void>();

   constructor() { }

   ngOnChanges()
   {
   }

   onDisposeRequested()
   {
      this.disposeRequested.emit();
   }
}
