import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {HttpParams} from '@angular/common/http';


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
      return this.location.prepareExternalUrl(`/api/tests/${testId}/report/${reportName}`);
   }

   auditLogEntriesQueryUrl
      (
         dateOrDateRange: string[] | null,
         testId: number | null,
         username: string | null,
         includeChangeData: boolean,
         includeUnchangedSaves: boolean
      )
      : string
   {
      let searchParams = new HttpParams();

      if ( dateOrDateRange )
         searchParams = searchParams.append('date', dateOrDateRange[0] + (dateOrDateRange.length === 2 ? '-' + dateOrDateRange[1] : ''));
      if ( testId )
         searchParams = searchParams.append('test', testId.toString());
      if ( username )
         searchParams = searchParams.append('user', username);
      searchParams =
         searchParams
         .append('data', includeChangeData ? '1' : '0')
         .append('unch', includeUnchangedSaves ? '1' : '0');

      return this.location.prepareExternalUrl('/api/audit-log/entries') + '?' + searchParams.toString();
   }

   isAppApiUrl(url: string)
   {
      return url.startsWith(this.API_PREFIX);
   }
}
