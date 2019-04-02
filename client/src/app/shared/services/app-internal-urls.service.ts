import { Injectable } from '@angular/core';
import {LabTestTypeCode} from '../../../generated/dto';

@Injectable({providedIn: 'root'})
export class AppInternalUrlsService {

   constructor() {}

   login(): any[]
   {
      return ['/login'];
   }

   home(): any[]
   {
      return [''];
   }

   personInbox(): any[]
   {
      return ['/person-inbox'];
   }

   testAttachedFilesEditor(testId: number): any[]
   {
      return ['/test', testId, 'attached-files-editor'];
   }

   testAttachedFilesView(testId: number): any[]
   {
      return ['/test', testId, 'attached-files-view'];
   }

   // The below are routed to the routers within the modules for each test type.
   // Each test type module should handle routes for the trailing parts of the
   // url below after the "/test-types/<type-code>" prefix.

   testDataEntry(testTypeCode: LabTestTypeCode, testId: number): any[]
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId];
   }

   testDataView(testTypeCode: LabTestTypeCode, testId: number): any[]
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-view', testId];
   }

   testStageDataEntry(testTypeCode: LabTestTypeCode, testId: number, stageName: string)
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId, 'stage', stageName];
   }

   testStageDataView(testTypeCode: LabTestTypeCode, testId: number, stageName: string)
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-view', testId, 'stage', stageName];
   }


   testReportsListing(testTypeCode: LabTestTypeCode, testId: number): any[]
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'reports-listing', testId];
   }
}

function lowerCaseDashSeparated(s: string)
{
   return s.toLowerCase().replace(/_/g, '-');
}
