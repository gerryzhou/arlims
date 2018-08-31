import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuditLogReviewComponent} from './audit-log-review/audit-log-review.component';

const routes: Routes = [
   {
      path: 'review',
      component: AuditLogReviewComponent,
      data: {title: 'Review Audit Log'},
   },
];

@NgModule({
   imports: [
      RouterModule.forChild(routes)
   ],
   exports: [
      RouterModule
   ]
})
export class AuditLogRoutingModule { }
