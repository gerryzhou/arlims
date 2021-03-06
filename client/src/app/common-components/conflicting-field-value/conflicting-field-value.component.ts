import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {EmployeeTimestamp} from '../../shared/client-models/employee-timestamp';

@Component({
  selector: 'app-conflicting-field-value',
  templateUrl: './conflicting-field-value.component.html',
  styleUrls: ['./conflicting-field-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConflictingFieldValueComponent implements OnChanges {

   @Input()
   conflictValue: any;

   @Input()
   conflictWhoWhen: EmployeeTimestamp;

   @Output()
   dismiss = new EventEmitter<void>();

   constructor() { }

   ngOnChanges(changes: SimpleChanges): void {
   }

   onDismissClick() {
     this.dismiss.next();
   }
}
