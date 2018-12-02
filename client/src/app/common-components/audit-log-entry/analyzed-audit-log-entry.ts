import {AuditLogEntry} from '../../../generated/dto';
import {DataFieldDiff, atomicValuesDiffList} from '../../shared/util/data-objects';

export class AnalyzedAuditLogEntry
{
   entry: AuditLogEntry;

   actionObjectText: string;

   objectContextMetadata: any | null;

   objectFromValue: any | null;

   objectToValue: any | null;

   dataFieldDiffs: DataFieldDiff[] | null;

   attachedFileDescrs: AttachedFileDescr[] | null;

   constructor(entry: AuditLogEntry)
   {
      this.entry = entry;
      this.actionObjectText = this.makeActionObjectText(entry);
      this.objectContextMetadata = entry.objectContextMetadataJson ? JSON.parse(entry.objectContextMetadataJson) : null;
      this.objectFromValue = entry.objectFromValueJson ? JSON.parse(entry.objectFromValueJson) : null;
      this.objectToValue = entry.objectToValueJson ? JSON.parse(entry.objectToValueJson) : null;

      this.dataFieldDiffs = AnalyzedAuditLogEntry.generateDataFieldDiffs(entry) ?
         atomicValuesDiffList(this.objectFromValue, this.objectToValue).sort((d1, d2) => d1.path.localeCompare(d2.path))
         : null;

      this.attachedFileDescrs =
         entry.action === 'attach-files' || entry.action === 'detach-files' ? this.objectToValue || this.objectFromValue : null;
   }

   isStructureOnlyTestDataUpdate(): boolean
   {
      return (
         this.entry.action === 'update' && this.entry.objectType === 'test-data' &&
         (!this.dataFieldDiffs || this.dataFieldDiffs.length === 0)
      );
   }

   private makeActionObjectText(entry: AuditLogEntry)
   {
      if ( entry.action === 'attach-files' )
         return 'ATTACH FILES TO ' + entry.objectType.toUpperCase();
      else if ( entry.action === 'detach-files' )
         return 'DETACH FILES FROM ' + entry.objectType.toUpperCase();
      else
         return entry.action.toUpperCase() + ' ' + entry.objectType.toUpperCase();
   }

   private static generateDataFieldDiffs(entry: AuditLogEntry): boolean
   {
     return (
        entry.action === 'update' && entry.objectType === 'test-data'
     );
   }
}


export interface AttachedFileDescr
{
   testAttachedFileId: number;
   fileName: string;
   size: number;
   label: string | null;
   ordering: number | null;
}

