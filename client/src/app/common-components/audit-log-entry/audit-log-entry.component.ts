import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AnalyzedAuditLogEntry} from './analyzed-audit-log-entry';

@Component({
   selector: 'app-audit-log-entry',
   templateUrl: './audit-log-entry.component.html',
   styleUrls: ['./audit-log-entry.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogEntryComponent implements OnChanges
{
   @Input()
   analyzedEntry: AnalyzedAuditLogEntry;

   @Input()
   showSampleMetadata: boolean;

   @Input()
   showTestMetadata: boolean;

   hasSampleMetadata: boolean;
   hasTestMetadata: boolean;

   sampleNum: string | null;
   sampleOrg: string | null;
   sampleProductName: string | null;
   sampleLid: string | null;
   samplePac: string | null;
   samplePaf: string | null;

   testBeginDate: string | null;
   testTypeShortName: string | null;

   constructor() {}

   ngOnChanges(changes: SimpleChanges): void
   {
      const omd = this.analyzedEntry.objectContextMetadata || {};
      this.sampleNum = omd['SAMPLE_NUM'] || null;
      this.sampleOrg = omd['SAMPLING_ORG'] || null;
      this.sampleProductName = omd['PRODUCT_NAME'] || null;
      this.sampleLid = omd['LID'] || null;
      this.samplePac = omd['PAC'] || null;
      this.samplePaf = omd['PAF'] || null;
      this.testBeginDate = omd['TEST_BEGIN_DATE'] || null;
      this.testTypeShortName = omd['TEST_TYPE_SHORT_NAME'] || null;

      this.hasSampleMetadata = this.sampleNum != null;
      this.hasTestMetadata = this.testTypeShortName != null;
   }
}
