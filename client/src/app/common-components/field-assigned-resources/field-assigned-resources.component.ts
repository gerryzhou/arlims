import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
   selector: 'app-field-assigned-resources',
   templateUrl: './field-assigned-resources.component.html',
   styleUrls: ['./field-assigned-resources.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldAssignedResourcesComponent implements OnChanges {

   @Input()
   resourceCodes: Set<string> | undefined;

   @Output()
   select: EventEmitter<string> = new EventEmitter();

   @Output()
   remove: EventEmitter<string> = new EventEmitter();

   @Output()
   removeAll: EventEmitter<void> = new EventEmitter();

   constructor() { }

   ngOnChanges() {}

   onCodeClicked(code: string)
   {
      this.select.next(code);
   }

   onCloseClicked(code: string)
   {
      this.remove.next(code);
   }

   onRemoveAll()
   {
      this.removeAll.next();
   }
}
