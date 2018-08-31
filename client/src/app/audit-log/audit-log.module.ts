import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuditLogRoutingModule} from './audit-log-routing.module';
import {AuditLogAccessService} from './audit-log-access.service';
import {AuditLogReviewComponent} from './audit-log-review/audit-log-review.component';
import {InitialAuditLogEntriesResolver} from './initial-audit-log-entries-resolver';

@NgModule({
   imports: [
      CommonModule,
      AuditLogRoutingModule,
   ],
   declarations: [
      AuditLogReviewComponent,
   ],
   providers: [
      AuditLogAccessService,
      InitialAuditLogEntriesResolver,
   ],
})
export class AuditLogModule { }
