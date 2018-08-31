import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuditLogReviewComponent} from './audit-log-review/audit-log-review.component';
import {InitialAuditLogEntriesResolver} from './initial-audit-log-entries-resolver';


const routes: Routes = [
   {
      path: 'review',
      component: AuditLogReviewComponent,
      resolve: { initialEntries: InitialAuditLogEntriesResolver},
      data: {title: 'Review Audit Log'},
   },
];


@NgModule({
   imports: [
      RouterModule.forChild(routes)
   ],
   providers: [
     InitialAuditLogEntriesResolver,
   ],
   exports: [
      RouterModule
   ]
})
export class AuditLogRoutingModule { }
