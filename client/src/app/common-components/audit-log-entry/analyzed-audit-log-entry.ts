import {AuditLogEntry} from '../../../generated/dto';
import {DataFieldDiff, atomicValuesDiffList} from '../../shared/util/data-objects';

export class AnalyzedAuditLogEntry
{
   objectContextMetadata: any | null;

   objectFromValue: any | null;

   objectToValue: any | null;

   dataFieldDiffs: DataFieldDiff[] | null;

   constructor(public entry: AuditLogEntry)
   {
      this.objectContextMetadata = entry.objectContextMetadataJson ? JSON.parse(entry.objectContextMetadataJson) : null;
      this.objectFromValue = entry.objectFromValueJson ? JSON.parse(entry.objectFromValueJson) : null;
      this.objectToValue = entry.objectToValueJson ? JSON.parse(entry.objectToValueJson) : null;

      this.dataFieldDiffs = entry.action === 'update' && entry.objectType === 'test-data' ?
         atomicValuesDiffList(this.objectFromValue, this.objectToValue).sort((d1, d2) => d1.path.localeCompare(d2.path))
         : null;
   }
}


