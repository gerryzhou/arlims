import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {AuditLogEntry} from '../../../generated/dto';

@Component({
   selector: 'app-audit-log-entries-table',
   templateUrl: './audit-log-entries-table.component.html',
   styleUrls: ['./audit-log-entries-table.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogEntriesTableComponent implements OnChanges {

   @Input()
   entries: AuditLogEntry[];

   constructor() {}

   ngOnChanges()
   {
   }

}
