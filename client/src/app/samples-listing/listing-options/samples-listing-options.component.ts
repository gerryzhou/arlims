import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ListingOptions} from './listing-options';

@Component({
  selector: 'app-samples-listing-options',
  templateUrl: './samples-listing-options.component.html',
  styleUrls: ['./samples-listing-options.component.scss']
})
export class SamplesListingOptionsComponent implements OnInit {

   @Input()
   initialOptions: ListingOptions;

   @Output() optionsChanged = new EventEmitter<ListingOptions>();

   listingOptionsFormGroup: FormGroup;

   constructor() {}

   ngOnInit() {
      this.listingOptionsFormGroup =
         new FormGroup({
            searchText: new FormControl(this.initialOptions.searchText),
            includeSamplesAssignedOnlyToOtherUsers: new FormControl(this.initialOptions.includeSamplesAssignedOnlyToOtherUsers),
            showSampleDetails: new FormControl(this.initialOptions.showSampleDetails),
            limitSelectionToVisibleSamples: new FormControl(this.initialOptions.limitSelectionToVisibleSamples)
         });

      this.listingOptionsFormGroup.valueChanges.subscribe(data => this.onFormChange(data));
   }

   emitChangeEvent(data: ListingOptions) {
      this.optionsChanged.emit(data);
   }

   onFormChange(data: ListingOptions) {
      this.emitChangeEvent(data);
   }

}
