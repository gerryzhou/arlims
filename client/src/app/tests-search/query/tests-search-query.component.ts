import {Component, EventEmitter, Input, Output, OnChanges, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {Observable, Subscription, from as obsFrom} from 'rxjs';

import {UserContextService} from '../../shared/services';
import {LabTestType} from '../../../generated/dto';
import {SAMPLE_OP_STATUSES, SampleOpStatus} from '../../shared/models/sample-op-status';
import {TestsSearchQuery} from './tests-search-query';

@Component({
   selector: 'app-tests-search-query',
   templateUrl: './tests-search-query.component.html',
   styleUrls: ['./tests-search-query.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsSearchQueryComponent implements OnChanges, OnDestroy {

   @Input()
   initialQuery: TestsSearchQuery;

   @Output()
   queryChanged = new EventEmitter<TestsSearchQuery>();

   form: FormGroup;

   selectedStatusesCtl: AbstractControl;

   labTestTypes$: Observable<LabTestType[]>;

   private querySubscription: Subscription;

   readonly ALL_SAMPLE_OP_STATUSES: SampleOpStatus[] = SAMPLE_OP_STATUSES;

   constructor(userCtxSvc: UserContextService)
   {
      this.labTestTypes$ = obsFrom(
         userCtxSvc.getLabGroupContents()
         .then(lgc => lgc.supportedTestTypes)
      );
   }

   ngOnChanges()
   {
      this.form = new FormGroup({
         searchText: new FormControl(this.initialQuery.searchText),
         fromTimestamp: new FormControl(this.initialQuery.fromTimestamp),
         toTimestamp: new FormControl(this.initialQuery.toTimestamp),
         timestampPropertyName: new FormControl(this.initialQuery.timestampPropertyName),
         includeStatusCodes: new FormControl(this.initialQuery.includeStatusCodes),
         testTypeCode: new FormControl(this.initialQuery.testTypeCode),
      });

      if ( this.querySubscription )
         this.querySubscription.unsubscribe();
      this.querySubscription = this.form.valueChanges.subscribe(data => this.onFormChange(data));

      this.selectedStatusesCtl = this.form.get('includeStatusCodes');
   }

   ngOnDestroy()
   {
      this.querySubscription.unsubscribe();
   }

   emitChangeEvent(data: TestsSearchQuery)
   {
      this.queryChanged.emit(data);
   }

   onFormChange(data: TestsSearchQuery)
   {
      this.emitChangeEvent(data);
   }
}
