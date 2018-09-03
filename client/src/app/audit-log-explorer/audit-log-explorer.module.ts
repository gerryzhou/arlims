import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {
   MatButtonModule,
   MatDatepickerModule,
   MatInputModule,
   MatIconModule,
   MatMenuModule,
   MatSelectModule,
   MatSlideToggleModule
} from '@angular/material';

import {AuditLogExplorerRoutingModule} from './audit-log-explorer-routing.module';
import {AuditLogReviewInitialDataResolver} from './audit-log-review/audit-log-review-initial-data.resolver';
import {AuditLogReviewComponent} from './audit-log-review/audit-log-review.component';
import {DataOptionsComponent} from './audit-log-review/data-options-panel/data-options.component';
import {CommonComponentsModule} from '../common-components/common-components.module';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatIconModule,
      MatSelectModule,
      MatSlideToggleModule,
      MatButtonModule,
      MatDatepickerModule,
      MatMenuModule,
      //
      CommonComponentsModule,
      AuditLogExplorerRoutingModule,
   ],
   declarations: [
      AuditLogReviewComponent,
      DataOptionsComponent,
   ],
   providers: [
      AuditLogReviewInitialDataResolver,
   ],
})
export class AuditLogExplorerModule { }
