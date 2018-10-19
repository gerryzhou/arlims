import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
   selector: 'app-isolate-test-seq',
   templateUrl: './isolate-test-seq.component.html',
   styleUrls: ['./isolate-test-seq.component.scss']
})
export class IsolateTestSeqComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   @Input()
   selectiveAgarDisplayName: string;

   @Input()
   isolateNumber: number;

   @Input()
   showDisposeButton = false;

   @Output()
   disposeRequested = new EventEmitter<void>();

   constructor() { }

   ngOnChanges()
   {
      // TODO
   }

   onDisposeRequested()
   {
      this.disposeRequested.emit();
   }

   promptRecordIsolateFailure()
   {
      // TODO: Open modal dialog to get failure details.
      this.form.addControl('failure', new FormGroup({}));
   }

   promptClearIsolateFailure()
   {
      this.form.removeControl('failure');
   }
}
