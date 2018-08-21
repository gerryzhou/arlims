import { Injectable } from '@angular/core';
import {LabTestTypeCode} from '../../../generated/dto';

@Injectable({providedIn: 'root'})
export class AppInternalUrlsService {

   constructor() {}

   samplesListingWithSampleExpanded(expandSampleId: number): any[]
   {
      return ['/samples', {expsmp: `${expandSampleId}`}];
   }

   testDataEntry(testTypeCode: LabTestTypeCode, testId: number): any[]
   {
      return ['test-types', lowerCaseDashSeperated(testTypeCode.toString()), 'test-data-entry', testId];
   }

   testStageDataEntry(testTypeCode: LabTestTypeCode, testId: number, stageName: string)
   {
      return ['test-types', lowerCaseDashSeperated(testTypeCode.toString()), 'test-data-entry', testId, 'stage', stageName];
   }
}

function lowerCaseDashSeperated(s: string)
{
   return s.toLowerCase().replace(/_/g, '-');
}
