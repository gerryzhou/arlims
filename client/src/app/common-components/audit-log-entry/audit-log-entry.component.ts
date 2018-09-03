import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AnalyzedAuditLogEntry} from './analyzed-audit-log-entry';
import {AuditLogEntry} from '../../../generated/dto';
import {AtomicValueDiff} from '../../shared/util/data-objects';

@Component({
   selector: 'app-audit-log-entry',
   templateUrl: './audit-log-entry.component.html',
   styleUrls: ['./audit-log-entry.component.scss']
})
export class AuditLogEntryComponent implements OnChanges {

   @Input()
   analyzedEntry: AnalyzedAuditLogEntry;

   @Input()
   showTestMetadata: boolean;

   entry: AuditLogEntry;
   testDataValueDiffs: AtomicValueDiff[] | null;

   constructor() {}

   ngOnChanges(changes: SimpleChanges): void
   {
      this.entry = this.analyzedEntry.entry;
      this.testDataValueDiffs = this.analyzedEntry.testDataAtomicValueDiffs;
   }

}
