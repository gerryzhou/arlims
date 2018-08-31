import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {AuditEntry} from '../../../generated/dto';
import {AuditLogAccessService} from '../audit-log-access.service';

@Component({
  selector: 'app-audit-log-review',
  templateUrl: './audit-log-review.component.html',
  styleUrls: ['./audit-log-review.component.scss']
})
export class AuditLogReviewComponent implements OnInit {

   constructor
      (
         private auditLogSvc: AuditLogAccessService,
         private activatedRoute: ActivatedRoute
      )
   {}

   logEntries$: BehaviorSubject<AuditEntry[]>;

   ngOnInit()
   {
      this.logEntries$ = new BehaviorSubject(<AuditEntry[]>this.activatedRoute.snapshot.data['initialEntries']);
   }

}
