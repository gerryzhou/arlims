import { Injectable } from '@angular/core';
import { Location } from '@angular/common';


@Injectable({providedIn: 'root'})
export class ApiUrlsService {

   constructor(private location: Location) {}

   userContextUrl(): string {
      return this.location.prepareExternalUrl('/api/user/context');
   }

   newTestUrl(): string {
      return this.location.prepareExternalUrl('/api/test/new');
   }

   testDataUrl(testId: number): string {
      return this.location.prepareExternalUrl(`/api/test/data/${testId}`);
   }

   reportUrl(testId: number, reportName: string): string {
      return this.location.prepareExternalUrl(`/api/test/${testId}/report/${reportName}`);
   }

}
