import {LabGroupTestData} from '../models/lab-group-test-data';
import {TestAttachedFileMetadata} from '../../../generated/dto';

export function makeAttachedFilesByTestPartMap(labGroupTestData: LabGroupTestData): Map<string|null, TestAttachedFileMetadata[]>
{
   const m = new Map<string | null, TestAttachedFileMetadata[]>();

   for (const af of labGroupTestData.attachedFiles)
   {
      const partFiles = m.get(af.testDataPart);
      if (partFiles === undefined)
         m.set(af.testDataPart, [af]);
      else
         partFiles.push(af);
   }

   return m;
}

