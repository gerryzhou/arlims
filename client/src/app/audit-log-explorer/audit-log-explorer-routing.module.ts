import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuditLogReviewComponent} from './audit-log-review/audit-log-review.component';
import {AuditLogReviewInitialDataResolver} from './audit-log-review/audit-log-review-initial-data.resolver';

const routes: Routes = [
   {
      path: 'review',
      component: AuditLogReviewComponent,
      resolve: { initialData: AuditLogReviewInitialDataResolver },
      data: {title: 'Review Audit Log'},
   },
];

@NgModule({
   imports: [
      RouterModule.forChild(routes)
   ],
   providers: [
     AuditLogReviewInitialDataResolver,
   ],
   exports: [
      RouterModule
   ]
})
export class AuditLogExplorerRoutingModule { }
