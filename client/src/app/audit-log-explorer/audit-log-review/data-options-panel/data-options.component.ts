import {Component, EventEmitter, Input, Output, OnChanges, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

import {AuditLogDataOptions} from '../audit-log-data-options';

@Component({
   selector: 'app-audit-log-review-data-options',
   templateUrl: './data-options.component.html',
   styleUrls: ['./data-options.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataOptionsComponent implements OnChanges, OnDestroy {

   @Input()
   initialDataOptions: AuditLogDataOptions;

   @Input()
   usernames: string[];

   @Output() optionsChanged = new EventEmitter<AuditLogDataOptions>();

   optionsFormGroup: FormGroup;

   private optionsSubscription: Subscription;

   constructor() {}

   ngOnChanges()
   {
      this.optionsFormGroup =
         new FormGroup({
            fromMoment: new FormControl(this.initialDataOptions.fromMoment),
            toMoment: new FormControl(this.initialDataOptions.toMoment),
            testId: new FormControl(this.initialDataOptions.testId),
            username: new FormControl(this.initialDataOptions.username),
            includeChangeDetailData: new FormControl(this.initialDataOptions.includeChangeDetailData),
            includeUnchangedSaves: new FormControl(this.initialDataOptions.includeUnchangedSaves),
         });
      if (this.optionsSubscription)
         this.optionsSubscription.unsubscribe();
      this.optionsSubscription = this.optionsFormGroup.valueChanges.subscribe(data =>
         this.onFormDataChanged(data)
      );
   }

   ngOnDestroy()
   {
      this.optionsSubscription.unsubscribe();
   }

   onFormDataChanged(data: AuditLogDataOptions)
   {
      if ( data.toMoment )
         data.toMoment.endOf('day');

      this.optionsChanged.emit(data);
   }
}
