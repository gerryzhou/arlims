import {Component, EventEmitter, Input, Output, OnChanges, OnDestroy} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

import {ListingOptions} from './listing-options';
import {SAMPLE_OP_STATUSES, SampleOpStatus} from '../../shared/client-models/sample-op-status';

@Component({
   selector: 'app-samples-listing-options',
   templateUrl: './samples-listing-options.component.html',
   styleUrls: ['./samples-listing-options.component.scss'],
})
export class SamplesListingOptionsComponent implements OnChanges, OnDestroy {

   @Input()
   initialOptions: ListingOptions;

   @Input()
   showSaveIncludeStatuses = false;

   @Output()
   optionsChanged = new EventEmitter<ListingOptions>();

   @Output()
   saveIncludeStatuses = new EventEmitter<void>();

   form: FormGroup;

   includeStatusesCtl: AbstractControl;

   private optsSubscription: Subscription;

   readonly allIncompleteSampleOpStatuses: SampleOpStatus[] = SAMPLE_OP_STATUSES.filter(s => s.code !== 'C');

   constructor() {}

   ngOnChanges()
   {
      this.form = new FormGroup({
         searchText: new FormControl(this.initialOptions.searchText),
         limitSelectionToVisibleSamples: new FormControl(this.initialOptions.limitSelectionToVisibleSamples),
         showTestDeleteButtons: new FormControl(this.initialOptions.showTestDeleteButtons),
         includeStatuses: new FormControl(this.initialOptions.includeStatuses),
      });

      if ( this.optsSubscription )
         this.optsSubscription.unsubscribe();
      this.optsSubscription = this.form.valueChanges.subscribe(data => this.onFormChange(data));

      this.includeStatusesCtl = this.form.get('includeStatuses');
   }

   ngOnDestroy()
   {
      this.optsSubscription.unsubscribe();
   }

   emitChangeEvent(data: ListingOptions)
   {
      this.optionsChanged.emit(data);
   }

   emitSaveIncludeStatusesEvent()
   {
      this.saveIncludeStatuses.emit(null);
   }

   onFormChange(data: ListingOptions)
   {
      this.emitChangeEvent(data);
   }

}
