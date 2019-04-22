import { Injectable } from '@angular/core';
import {LabGroupContentsScope, LabTestTypeCode} from '../../../generated/dto';
import {HttpParams} from '@angular/common/http';

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

   testAttachedFilesEditor
      (
         testId: number,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test', testId, 'attached-files-editor'],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
     });
   }

   testAttachedFilesView
      (
         testId: number,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test', testId, 'attached-files-view'],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
      });
   }

   // The below are routed to the routers within the modules for each test type.
   // Each test type module should handle routes for the trailing parts of the
   // url below after the "/test-types/<type-code>" prefix.

   testDataEntry
      (
         testTypeCode: LabTestTypeCode,
         testId: number,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
      });
   }

   testDataView
      (
         testTypeCode: LabTestTypeCode,
         testId: number,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-view', testId],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
      });
   }

   testStageDataEntry
      (
         testTypeCode: LabTestTypeCode,
         testId: number,
         stageName: string,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-entry', testId, 'stage', stageName],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
      });
   }

   testStageDataView
      (
         testTypeCode: LabTestTypeCode,
         testId: number,
         stageName: string,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'test-data-view', testId, 'stage', stageName],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
      });
   }

   testReportsListing
      (
         testTypeCode: LabTestTypeCode,
         testId: number,
         labGroupContentsScope: LabGroupContentsScope,
         exitRouterPath: string
      )
      : PathWithParams
   {
      return ({
         path: ['/test-types', lowerCaseDashSeparated(testTypeCode.toString()), 'reports-listing', testId],
         queryParams: {
            'lgc-scope': labGroupContentsScope,
            exitRouterPath
         }
      });
   }

   testReport
      (
         testTypeCode: LabTestTypeCode,
         testId: number,
         reportName: string,
         labGroupContentsScope: LabGroupContentsScope
      )
      : PathWithParams
   {
      const testType = lowerCaseDashSeparated(testTypeCode.toString());
      return ({
         path: [`test-types/${testType}/reports/${reportName}`, testId],
         queryParams: { 'lgc-scope': labGroupContentsScope }
      });
   }
}

function lowerCaseDashSeparated(s: string)
{
   return s.toLowerCase().replace(/_/g, '-');
}

export interface PathWithParams {
   path: any[];
   queryParams: { [paramName: string]: string };
}

