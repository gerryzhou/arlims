import {AuditLogEntry} from '../../../generated/dto';
import {AtomicValueDiff, atomicValuesDiffList} from '../../shared/util/data-objects';

export class AnalyzedAuditLogEntry
{
   testDataAtomicValueDiffs: AtomicValueDiff[] | null;

   constructor(public entry: AuditLogEntry)
   {
      this.testDataAtomicValueDiffs = entry.objectType === 'test' && entry.action === 'update' ?
         this.makeTestDataValueDiffs(entry.objectFromValueJson, entry.objectToValueJson)
         : null;

      const contextMetadata = JSON.parse(entry.objectContextMetadataJson);
      // TODO: Set common context fields here for the general multiple-test log viewing case.
   }

   private makeTestDataValueDiffs(fromValueJson: string, toValueJson: string): AtomicValueDiff[]
   {
      const fromValue = JSON.parse(fromValueJson);
      const toValue = JSON.parse(toValueJson);

      const diffs = atomicValuesDiffList(fromValue, toValue).sort((diff1, diff2) =>
         diff1.path.localeCompare(diff2.path)
      );

      return diffs;
   }
}


