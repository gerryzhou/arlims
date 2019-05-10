import {Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {LabTestType, TestTypeSearchScope} from '../../../generated/dto';
import {emptyTestsSearchQuery, TestsSearchQuery} from './tests-search-query';

@Component({
   selector: 'app-tests-search-query',
   templateUrl: './tests-search-query.component.html',
   styleUrls: ['./tests-search-query.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsSearchQueryComponent implements OnChanges {

   @Input()
   testTypeSearchScopes: TestTypeSearchScope[];

   @Input()
   initialQuery: TestsSearchQuery;

   @Input()
   labTestTypes: LabTestType[];

   @Output()
   readonly queryClick = new EventEmitter<TestsSearchQuery>();

   searchScopesForSelectedTestType: TestTypeSearchScope[] = [];

   form: FormGroup;

   constructor()
   {
   }

   ngOnChanges()
   {
      if ( !this.form )
          this.form = new FormGroup({
             searchText: new FormControl(this.initialQuery.searchText),
             fromTimestamp: new FormControl(this.initialQuery.fromTimestamp),
             toTimestamp: new FormControl(this.initialQuery.toTimestamp),
             timestampPropertyName: new FormControl(this.initialQuery.timestampPropertyName),
             testTypeCode: new FormControl(this.initialQuery.testTypeCode),
             testTypeSearchScopeName: new FormControl(this.initialQuery.testTypeSearchScopeName),
          });
      else
         this.form.setValue(this.initialQuery);
   }

   onQueryClicked()
   {
      this.queryClick.emit(this.form.value);
   }

   clearSearch()
   {
      this.form.setValue(emptyTestsSearchQuery());
   }

   onTestTypeChanged(testTypeCode: string)
   {
      this.searchScopesForSelectedTestType = this.testTypeSearchScopes.filter(ttss => ttss.testTypeCode === testTypeCode);
      this.form.get('testTypeSearchScopeName').setValue(null);
   }
}
