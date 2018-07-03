import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../generated/dto';

@Component({
  selector: 'app-samples-listing',
  templateUrl: './samples-listing.component.html',
  styleUrls: ['./samples-listing.component.scss']
})
export class SamplesListingComponent implements OnInit {

   @Input()
   samples: Sample[];

   constructor() { }

   ngOnInit() {
   }
}
