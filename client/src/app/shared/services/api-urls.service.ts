import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {HttpParams} from '@angular/common/http';
import {Moment} from 'moment';

import {LabTestTypeCode} from '../../../generated/dto';


@Injectable({providedIn: 'root'})
export class ApiUrlsService {

   private readonly API_PREFIX: string;

   constructor(private location: Location)
   {
      this.API_PREFIX = this.location.prepareExternalUrl('');
   }

   userContextUrl(): string
   {
      return this.location.prepareExternalUrl('/api/user/context');
   }

   labGroupContentsUrl(): string
   {
      return this.location.prepareExternalUrl(`/api/user/lab-group-contents`);
   }

   loginUrl()
   {
      return this.location.prepareExternalUrl(`/api/login`);
   }

   registerNewUserUrl()
   {
      return this.location.prepareExternalUrl(`/api/user/register`);
   }

   newTestUrl(): string
   {
      return this.location.prepareExternalUrl('/api/tests/new');
   }

   testUrl(testId: number): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}`);
   }

   testDataUrl(testId: number): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/data`);
   }

   restoreTestSaveDatasUrl(): string
   {
      return this.location.prepareExternalUrl(`/api/tests/restore-save-datas`);
   }

   testAttachedFilesMetadatasUrl(testId: number): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-files/metadatas`);
   }

   testAttachedFileMetadataUrl(attachedFileId: number, testId: number): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-files/${attachedFileId}/metadata`);
   }

   newTestAttachedFilesUrl(testId: number): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-files/new`);
   }

   testAttachedFileUrl(attachedFileId: number, testId: number): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-files/${attachedFileId}`);
   }

   reportUrl(testId: number, reportName: string): string
   {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/report/${encodeURIComponent(reportName)}`);
   }

   testsSearchUrl
      (
         textSearch: string | null,
         fromTimestamp: Moment | null,
         toTimestamp: Moment | null,
         timestampProperty: string | null,
         includeTestTypeCodes: LabTestTypeCode[] | null
      )
      : string
   {
      let qryParams = new HttpParams();

      if ( textSearch )
         qryParams = qryParams.append('tq', textSearch);
      if ( fromTimestamp )
         qryParams = qryParams.append('fts', fromTimestamp.toISOString());
      if ( toTimestamp )
         qryParams = qryParams.append('tts', toTimestamp.toISOString());
      if ( (fromTimestamp || toTimestamp) && timestampProperty )
         qryParams = qryParams.append('tsp', timestampProperty);
      if ( includeTestTypeCodes )
         qryParams = qryParams.append('ltt', JSON.stringify(includeTestTypeCodes));


      return this.location.prepareExternalUrl(`/api/tests/search?${qryParams.toString()}`);
   }

   auditLogEntriesQueryUrl
      (
         fromMoment: Moment | null,
         toMoment: Moment | null,
         testId: number | null,
         username: string | null,
         includeChangeDetailData: boolean,
         includeUnchangedSaves: boolean
      )
      : string
   {
      let qryParams = new HttpParams();

      if ( fromMoment )
         qryParams = qryParams.append('from', fromMoment.toISOString());
      if ( toMoment )
         qryParams = qryParams.append('to', toMoment.toISOString());
      if ( testId )
         qryParams = qryParams.append('test', testId.toString());
      if ( username )
         qryParams = qryParams.append('user', username);
      qryParams =
         qryParams
         .append('data', includeChangeDetailData ? '1' : '0')
         .append('unch', includeUnchangedSaves ? '1' : '0');

      return this.location.prepareExternalUrl(`/api/audit-log/entries?${qryParams.toString()}`);
   }

   testModifyingEmployeeIdsUrl(testId: number)
   {
      return this.location.prepareExternalUrl(`/api/audit-log/${testId}/modifying-employees`);
   }

   factsSampleOpWorkStatusUrl(opId: number, factsPersonId: number)
   {
      return this.location.prepareExternalUrl(`/api/facts/sample-op/${opId}/work-status/${factsPersonId}`);
   }

   factsSampleTransfersUrl(sampleTrackingNumber: number, toPersonId: number | null)
   {
      const params = toPersonId ? new HttpParams().append('to', toPersonId.toString()) : null;

      return this.location.prepareExternalUrl(
         `/api/facts/samples/${sampleTrackingNumber}/transfers` + (params ? '?' + params.toString() : '')
      );
   }

   factsMicrobiologySampleAnalysisUrl()
   {
      return this.location.prepareExternalUrl('/api/facts/sample-analysis/micro');
   }

   factsTimeChargesUrl()
   {
      return this.location.prepareExternalUrl('/api/facts/time-charges');
   }

   isAppApiUrl(url: string)
   {
      return url.startsWith(this.API_PREFIX);
   }
}
