import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import * as moment from 'moment';

import {AuditEntry} from '../../generated/dto';
import {AuditLogAccessService} from './audit-log-access.service';

@Injectable()
export class InitialAuditLogEntriesResolver implements Resolve<AuditEntry[]> {

   constructor(private auditLogSvc: AuditLogAccessService) {}

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuditEntry[]>
   {
      return this.auditLogSvc.getEntries(
         [moment().format('YYYY-MM-DD')],
         null,
         null,
         false,
         true
      );
   }
}
