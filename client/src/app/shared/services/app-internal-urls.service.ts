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

   samplesListing(): any[]
   {
      return ['/samples'];
   }

   testDataEntry(testTypeCode: LabTestTypeCode, testId: number): any[]
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId];
   }

   testStageDataEditor(testTypeCode: LabTestTypeCode, testId: number, stageName: string)
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId, 'stage', stageName];
   }

   testStageDataView(testTypeCode: LabTestTypeCode, testId: number, stageName: string)
   {
      return ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-view', testId, 'stage', stageName];
   }

   testAttachedFilesEditor(testId: number): any[]
   {
      return ['/test', testId, 'attached-files-editor'];
   }

   testAttachedFilesView(testId: number): any[]
   {
      return ['/test', testId, 'attached-files-view'];
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
