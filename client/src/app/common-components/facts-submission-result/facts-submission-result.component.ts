import {Component, Input, OnChanges} from '@angular/core';
import * as moment from 'moment';

import {FactsSubmissionResult} from '../../shared/client-models/facts-submission-result-types';

@Component({
   selector: 'app-facts-submission-result',
   templateUrl: './facts-submission-result.component.html',
   styleUrls: ['./facts-submission-result.component.scss']
})
export class FactsSubmissionResultComponent implements OnChanges {

   @Input()
   factsSubmissionResult: FactsSubmissionResult;

   submissionTimestamp: string;
   success: boolean;
   failureMessage: string | null;

   constructor() {}

   ngOnChanges()
   {
      this.submissionTimestamp =
         moment(this.factsSubmissionResult.submissionTimestamp).format('h:mm a MMM D');
      this.success = this.factsSubmissionResult.submissionSucceeded;
      this.failureMessage = this.factsSubmissionResult.failureMessage || null;
   }
}
