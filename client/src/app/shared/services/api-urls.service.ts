import { Injectable } from '@angular/core';
import { Location } from '@angular/common';


@Injectable({providedIn: 'root'})
export class ApiUrlsService {

   constructor(private location: Location) {}

   userContextUrl(): string {
      return this.location.prepareExternalUrl('/api/user/context');
   }

   newTestUrl(): string {
      return this.location.prepareExternalUrl('/api/tests/new');
   }

   testDataUrl(testId: number): string {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/data`);
   }

   testAttachedFileMetadatasUrl(testId: number): string {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-file-metadatas`);
   }

   newTestAttachedFileUrl(testId: number): string {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-files/new`);
   }

   testAttachedFileUrl(attachedFileId: number, testId: number): string {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/attached-files/${attachedFileId}`);
   }

   reportUrl(testId: number, reportName: string): string {
      return this.location.prepareExternalUrl(`/api/tests/${testId}/report/${reportName}`);
   }

}
