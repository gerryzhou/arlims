import { Injectable } from '@angular/core';
import { Location } from '@angular/common';


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

   labGroupContentsUrl(empId: number): string
   {
      return this.location.prepareExternalUrl(`/api/user/${empId}/lab-group-contents`);
   }

   loginUrl()
   {
      return this.location.prepareExternalUrl(`/login`);
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

   registerNewUserUrl(): string
   {
      return this.location.prepareExternalUrl(`/api/user/register`);
   }


   isAppApiUrl(url: string)
   {
      return url.startsWith(this.API_PREFIX);
   }
}
