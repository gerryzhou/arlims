import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {UserContextService, AuditLogQueryService} from '../../shared/services';
import {AuditLogEntry} from '../../../generated/dto';
import {AuditLogDataOptions} from './audit-log-data-options';
import {AuditLogReviewInitialData} from './audit-log-review-initial-data.resolver';

@Component({
   selector: 'app-audit-log-review',
   templateUrl: './audit-log-review.component.html',
   styleUrls: ['./audit-log-review.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogReviewComponent
{
   logEntries$: BehaviorSubject<AuditLogEntry[]>;

   labGroupUsernames$: Observable<string[]>;

   readonly initialDataOptions: AuditLogDataOptions;

   constructor
      (
         private auditLogSvc: AuditLogQueryService,
         private userCtxSvc: UserContextService,
         route: ActivatedRoute,
      )
   {
      const {dataOptions, entries} = route.snapshot.data['initialData'] as AuditLogReviewInitialData;

      this.initialDataOptions = dataOptions;

      this.logEntries$ = new BehaviorSubject(entries);

      this.labGroupUsernames$ = userCtxSvc.getLabGroupContents().pipe(
         map(lgc => lgc.memberUsers.map(uref => uref.username))
      );
   }

   reloadEntries(dataOptions: AuditLogDataOptions)
   {
      this.auditLogSvc.getEntries(
         dataOptions.fromMoment,
         dataOptions.toMoment,
         dataOptions.testId,
         dataOptions.username,
         dataOptions.includeChangeData,
         dataOptions.includeUnchangedSaves
      )
      .subscribe(entries => {
         this.logEntries$.next(entries);
      });
   }
}
