import * as moment from 'moment';

import {
   cloneDataObject,
   getDisplayableFieldDiffsByFieldParentPath,
   ParentPathDisplayableFieldDiffs
} from '../../../../shared/util/data-objects';
import {arrayContainsNonValue, arrayContainsValue, countValueOccurrences} from '../../../test-stages';
import {TestData} from '../test-data';
import {AuditLogEntry} from '../../../../../generated/dto';
import {AnalyzedAuditLogEntry, AttachedFileDescr} from '../../../../common-components/audit-log-entry/analyzed-audit-log-entry';

export const IMP_SLM_VIDAS_PDF_REPORT_NAME = 'imp_slm_vidas.pdf';
const SIX_SPACES = Array(7).join(' ');
const THIRTY_SPACES = Array(31).join(' ');

export function makePdfReportData(testData: TestData, auditLogEntries: AuditLogEntry[] | null): any
{
   if ( !testData )
      return {};

   const repData = cloneDataObject(testData) as any;

   repData.prepData.labelAttachmentType = testData.prepData.labelAttachmentType != null ?
      testData.prepData.labelAttachmentType.toLowerCase().replace('_', ' ')
      : null;

   if ( testData.preEnrData.positiveControlGrowth != null  )
   {
      repData.preEnrData.positiveControlGrowth = testData.preEnrData.positiveControlGrowth ? 'Growth' : 'No growth';
      if ( !testData.preEnrData.positiveControlGrowth ) repData.preEnrData.positiveControlGrowthWarn = '*';
   }

   if ( testData.preEnrData.mediumControlGrowth != null  )
   {
      repData.preEnrData.mediumControlGrowth = testData.preEnrData.mediumControlGrowth ? 'Growth' : 'No growth';
      if ( testData.preEnrData.mediumControlGrowth ) repData.preEnrData.mediumControlGrowthWarn = '*';
   }

   if ( testData.vidasData.positiveControlDetection != null )
   {
      repData.vidasData.positiveControlDetection = testData.vidasData.positiveControlDetection ? 'POS' : 'NEG';
      if ( !testData.vidasData.positiveControlDetection ) repData.vidasData.positiveControlDetectionWarn = '*';
   }

   if ( testData.vidasData.mediumControlDetection != null )
   {
      repData.vidasData.mediumControlDetection = testData.vidasData.mediumControlDetection ? 'POS' : 'NEG';
      if ( testData.vidasData.mediumControlDetection ) repData.vidasData.mediumControlDetectionWarn = '*';
   }

   if ( testData.vidasData.testUnitDetections != null )
   {
      repData.vidasData.compositeDetectionsList = makeCompositeDetectionsListText(testData.vidasData.testUnitDetections);

      const compositeDetectionsComplete =
         arrayContainsValue(testData.vidasData.testUnitDetections) &&
         !arrayContainsNonValue(testData.vidasData.testUnitDetections);

      repData.positiveCompositesCount = compositeDetectionsComplete ?
         countValueOccurrences(testData.vidasData.testUnitDetections, true)
         : null;

      if ( repData.positiveCompositesCount > 0 || !compositeDetectionsComplete )
      {
         repData.positiveCompositesCountWarn = '*';
         repData.vidasData.compositeDetectionsListWarn = '*';
      }
   }

   if ( testData.vidasData.spikeDetection != null )
   {
      repData.vidasData.spikeDetection = testData.vidasData.spikeDetection ? 'POS' : 'NEG';
      if ( !testData.vidasData.spikeDetection ) repData.vidasData.spikeDetectionWarn = '*';
   }

   if ( testData.controlsData.systemControlsGrowth != null )
   {
      repData.controlsData.systemControlsGrowth = testData.controlsData.systemControlsGrowth ? 'Growth' : 'No growth';
      if ( testData.controlsData.systemControlsGrowth ) repData.controlsData.systemControlsGrowthWarn = '*';
   }

   if ( testData.controlsData.collectorControlsGrowth != null )
   {
      repData.controlsData.collectorControlsGrowth = testData.controlsData.collectorControlsGrowth ? 'Growth' : 'No growth';
      if ( testData.controlsData.collectorControlsGrowth ) repData.controlsData.collectorControlsGrowthWarn = '*';
   }

   repData.wrapupData.reserveSampleDisposition = testData.wrapupData.reserveSampleDisposition != null ?
      testData.wrapupData.reserveSampleDisposition.toLowerCase().replace('_', ' ')
      : null;

   repData._appendices = [];

   if ( auditLogEntries )
      repData._appendices.push({title: 'Audit Log', text: makeAuditLogText(auditLogEntries)});

   return repData;
}

function makeCompositeDetectionsListText(detections: boolean[]): string
{
   function detValue(det: boolean | null): string
   {
      return det == null ? '' : det ? 'POS' : 'NEG';
   }
   return (
      detections
         .map((det, ix) => `Composite ${ix + 1}: ${detValue(det)}`)
         .join('\n')
   );
}

function makeAuditLogText(auditLogEntries: AuditLogEntry[]): string
{
   return (
      auditLogEntries
         .map(e => new AnalyzedAuditLogEntry(e))
         .filter(ae => ae.entry.action !== 'save-unchanged' && !ae.isStructureOnlyTestDataUpdate())
         .map(auditLogEntryText)
         .join('\n')
   );
}

function auditLogEntryText(ae: AnalyzedAuditLogEntry): string
{
   const fieldDiffsByParentPath = ae.dataFieldDiffs ? getDisplayableFieldDiffsByFieldParentPath(ae.dataFieldDiffs) : null;

   const detailParts: string[] = [];

   if ( fieldDiffsByParentPath )
      detailParts.push(fieldDiffsText(fieldDiffsByParentPath, '   '));

   if ( ae.attachedFileDescrs )
      detailParts.push('   ' + ae.attachedFileDescrs.map(describeAttachedFile).join('\n   '));

   return padstr(ae.actionObjectText, THIRTY_SPACES) + ' ' +
          padstr(ae.entry.actingUsername, THIRTY_SPACES) +
          ' at ' + moment(ae.entry.timestamp).format('h:mm a, D MMM YYYY') + '\n' +
      detailParts.join('\n');
}

function fieldDiffsText(fieldDiffsByParentPath: ParentPathDisplayableFieldDiffs[], linePrefix: string | null): string
{
   const res: string[] = [];

   for (const parentPathFieldDiffs of fieldDiffsByParentPath)
   {
      if ( linePrefix ) res.push(linePrefix);

      res.push(parentPathFieldDiffs.fieldsParentPath + '\n');

      for (const fieldDiff of parentPathFieldDiffs.fieldDiffs)
      {
         if ( linePrefix ) res.push(linePrefix);

         res.push('   ' + fieldDiff.fieldName + '\n');

         if ( linePrefix ) res.push(linePrefix);

         res.push('      ' + padstr(fieldDiff.diffTypeText, SIX_SPACES) + ' ');

         if ( fieldDiff.diffType !== 'new' )
            res.push(fieldDiff.fromValue);
         if ( fieldDiff.diffType === 'updated' )
            res.push(' => ');
         if ( fieldDiff.diffType !== 'removed' )
            res.push(fieldDiff.toValue);

         res.push('\n');
      }
   }

   return res.join('');
}

function describeAttachedFile(attachedFile: AttachedFileDescr): string
{
   return attachedFile.fileName + '  ' + (attachedFile.size / 1000) + ' KB' +
      (attachedFile.role ? '  [' + attachedFile.role + ']' : '') +
      '\n';
}

function padstr(str: string, pad: string, padLeft: boolean = false)
{
   if (padLeft) return (pad + str).slice(-pad.length);
   else return (str + pad).substring(0, pad.length);
}

