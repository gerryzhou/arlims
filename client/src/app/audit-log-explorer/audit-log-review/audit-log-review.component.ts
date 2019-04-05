import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, from, Observable} from 'rxjs';

import {UserContextService, AuditLogQueryService} from '../../shared/services';
import {AuditLogDataOptions} from './audit-log-data-options';
import {AuditLogReviewInitialData} from './audit-log-review-initial-data.resolver';
import {AnalyzedAuditLogEntry} from '../../common-components/audit-log-entry/analyzed-audit-log-entry';

@Component({
   selector: 'app-audit-log-review',
   templateUrl: './audit-log-review.component.html',
   styleUrls: ['./audit-log-review.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogReviewComponent
{
   analyzedAuditLogEntries$: BehaviorSubject<AnalyzedAuditLogEntry[]>;

   labGroupUsernames$: Observable<string[]>;

   includeDataChangeDetails$: BehaviorSubject<boolean>;

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

      this.analyzedAuditLogEntries$ = new BehaviorSubject(entries.map(e => new AnalyzedAuditLogEntry(e)));

      this.labGroupUsernames$ = from(
         userCtxSvc.getLabGroupContents()
         .then(lgc => lgc.memberUsers.map(uref => uref.username))
      );

      this.includeDataChangeDetails$ = new BehaviorSubject(dataOptions.includeChangeDetailData);
   }

   reloadEntries(dataOptions: AuditLogDataOptions)
   {
      this.auditLogSvc.getEntries(
         dataOptions.fromMoment,
         dataOptions.toMoment,
         dataOptions.testId,
         dataOptions.username,
         dataOptions.includeChangeDetailData,
         dataOptions.includeUnchangedSaves
      )
      .subscribe(entries => {
         this.includeDataChangeDetails$.next(dataOptions.includeChangeDetailData);
         this.analyzedAuditLogEntries$.next(
            entries.map(e => new AnalyzedAuditLogEntry(e))
               .filter(ae => !ae.isStructureOnlyTestDataUpdate())
         );
      });
   }
}
