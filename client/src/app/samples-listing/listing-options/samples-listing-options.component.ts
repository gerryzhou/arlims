import {Component, EventEmitter, Input, Output, OnChanges, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ListingOptions} from './listing-options';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-samples-listing-options',
  templateUrl: './samples-listing-options.component.html',
  styleUrls: ['./samples-listing-options.component.scss']
})
export class SamplesListingOptionsComponent implements OnChanges, OnDestroy {

   @Input()
   initialOptions: ListingOptions;

   @Output() optionsChanged = new EventEmitter<ListingOptions>();

   listingOptionsFormGroup: FormGroup;

   private optsSubscription: Subscription;

   constructor() {}

   ngOnChanges() {
      this.listingOptionsFormGroup =
         new FormGroup({
            searchText: new FormControl(this.initialOptions.searchText),
            includeSamplesAssignedOnlyToOtherUsers: new FormControl(this.initialOptions.includeSamplesAssignedOnlyToOtherUsers),
            limitSelectionToVisibleSamples: new FormControl(this.initialOptions.limitSelectionToVisibleSamples)
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
