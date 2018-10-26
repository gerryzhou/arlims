import {Component, EventEmitter, Input, Output, OnChanges, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ListingOptions, SAMPLE_OP_STATUSES, SampleOpStatus} from './listing-options';
import {Subscription} from 'rxjs';

@Component({
   selector: 'app-samples-listing-options',
   templateUrl: './samples-listing-options.component.html',
   styleUrls: ['./samples-listing-options.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SamplesListingOptionsComponent implements OnChanges, OnDestroy {

   @Input()
   initialOptions: ListingOptions;

   @Output() optionsChanged = new EventEmitter<ListingOptions>();

   listingOptionsFormGroup: FormGroup;

   private optsSubscription: Subscription;

   readonly allIncompleteSampleOpStatuses: SampleOpStatus[] = SAMPLE_OP_STATUSES.filter(s => s.code !== 'C');

   constructor() {}

   ngOnChanges() {
      this.listingOptionsFormGroup =
         new FormGroup({
            searchText: new FormControl(this.initialOptions.searchText),
            includeSamplesAssignedOnlyToOtherUsers: new FormControl(this.initialOptions.includeSamplesAssignedOnlyToOtherUsers),
            limitSelectionToVisibleSamples: new FormControl(this.initialOptions.limitSelectionToVisibleSamples),
            showTestDeleteButtons: new FormControl(this.initialOptions.showTestDeleteButtons),
            includeStatuses: new FormControl(this.initialOptions.includeStatuses),
         });

      this.optsSubscription = this.listingOptionsFormGroup.valueChanges.subscribe(data => this.onFormChange(data));
   }

   ngOnDestroy() {
      this.optsSubscription.unsubscribe();
   }

   emitChangeEvent(data: ListingOptions) {
      this.optionsChanged.emit(data);
   }

   onFormChange(data: ListingOptions) {
      this.emitChangeEvent(data);
   }

}
