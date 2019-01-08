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

   samplesListingWithSampleExpanded(expandSampleOpId: number): any[]
   {
      return ['/samples', {expsmp: `${expandSampleOpId}`}];
   }

   testDataEntry(testTypeCode: LabTestTypeCode, testId: number): any[]
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId];
   }

   testStageDataEntry(testTypeCode: LabTestTypeCode, testId: number, stageName: string)
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId, 'stage', stageName];
   }

   testAttachedFiles(testId: number): any[]
   {
      return ['/test', testId, 'attached-files'];
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
