import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';

import {AuditLogEntry} from '../../../generated/dto';
import {AuditLogQueryService} from '../../shared/services';
import {AuditLogDataOptions} from './audit-log-data-options';

@Injectable()
export class AuditLogReviewInitialDataResolver implements Resolve<AuditLogReviewInitialData>
{
   constructor(private auditLogSvc: AuditLogQueryService) {}

   resolve
      (
         route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot
      )
      : Observable<AuditLogReviewInitialData>
   {
      const dataOpts: AuditLogDataOptions = {
         fromMoment: moment().startOf('day'),
         toMoment: null,
         testId: null,
         username: null,
         includeChangeData: false,
         includeUnchangedSaves: true
      };

      return (
         this.auditLogSvc.getEntries(
            dataOpts.fromMoment,
            dataOpts.toMoment,
            dataOpts.testId,
            dataOpts.username,
            dataOpts.includeChangeData,
            dataOpts.includeUnchangedSaves
         )
         .pipe(
            map(entries => ({ dataOptions: dataOpts, entries }))
         )
      );
   }
}

export interface AuditLogReviewInitialData
{
   dataOptions: AuditLogDataOptions;
   entries: AuditLogEntry[];
}

