import { Component, OnInit } from '@angular/core';
import {AuditLogAccessService} from '../audit-log-access.service';
import {Observable} from 'rxjs';
import {AuditEntry} from '../../../generated/dto';

@Component({
  selector: 'app-audit-log-review',
  templateUrl: './audit-log-review.component.html',
  styleUrls: ['./audit-log-review.component.scss']
})
export class AuditLogReviewComponent implements OnInit {

   constructor(private auditLogSvc: AuditLogAccessService) {}

   logEntries$: Observable<AuditEntry[]>;

   ngOnInit()
   {
      this.logEntries$ = this.auditLogSvc.getEntries(['2018/08/31'], null, null, false, true);
   }

}
