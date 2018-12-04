import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {HttpParams} from '@angular/common/http';
import {Moment} from 'moment';
import {SampleOpStatusCode} from "../models/sample-op-status";
import {LabTestTypeCode} from "../../../generated/dto";


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

   refreshUserOrganziationSampleOpsUrl(): string
   {
      return this.location.prepareExternalUrl(`/api/lab-group/refresh-user-org-sample-ops`);
   }

   testsSearchUrl
      (
         textSearch: string | null,
         fromTimestamp: Moment | null,
         toTimestamp: Moment | null,
         timestampProperty: string | null,
         includeStatusCodes: SampleOpStatusCode[] | null,
         includeTestTypeCodes: LabTestTypeCode[] | null
      )
      : string
   {
      let searchParams = new HttpParams();

      if ( textSearch )
         searchParams = searchParams.append('tq', textSearch);
      if ( fromTimestamp )
         searchParams = searchParams.append('fts', fromTimestamp.toISOString());
      if ( toTimestamp )
         searchParams = searchParams.append('tts', toTimestamp.toISOString());
      if ( (fromTimestamp || toTimestamp) && timestampProperty )
         searchParams = searchParams.append('tsp', timestampProperty);
      if ( includeStatusCodes )
         searchParams = searchParams.append('ss', JSON.stringify(includeStatusCodes));
      if ( includeTestTypeCodes )
         searchParams = searchParams.append('ltt', JSON.stringify(includeTestTypeCodes));


      return this.location.prepareExternalUrl(`/api/tests/search?${searchParams.toString()}`);
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
      let searchParams = new HttpParams();

      if ( fromMoment )
         searchParams = searchParams.append('from', fromMoment.toISOString());
      if ( toMoment )
         searchParams = searchParams.append('to', toMoment.toISOString());
      if ( testId )
         searchParams = searchParams.append('test', testId.toString());
      if ( username )
         searchParams = searchParams.append('user', username);
      searchParams =
         searchParams
         .append('data', includeChangeDetailData ? '1' : '0')
         .append('unch', includeUnchangedSaves ? '1' : '0');

      return this.location.prepareExternalUrl('/api/audit-log/entries') + '?' + searchParams.toString();
   }

   isAppApiUrl(url: string)
   {
      return url.startsWith(this.API_PREFIX);
   }
}
