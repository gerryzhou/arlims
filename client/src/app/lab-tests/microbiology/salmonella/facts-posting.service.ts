import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';

import {ContinuationTestssByTestUnitNum, TestData} from './test-data';
import {
   MicrobiologyAnalysisFinding,
   MicrobiologySampleAnalysis,
   MicrobiologySampleAnalysisSubmissionResponse
} from '../../../../generated/dto';
import {countValueOccurrences} from '../../test-stages';
import {ApiUrlsService, UserContextService} from '../../../shared/services';
import {HttpClient} from '@angular/common/http';

// FACTS posting service for the salmonella module.
@Injectable()
export class FactsPostingService {

   constructor
      (
         private usrCtxSvc: UserContextService,
         private apiUrlsSvc: ApiUrlsService,
         private httpClient: HttpClient
      )
   {}

   submitAOACAnalysisResults
      (
         testData: TestData,
         opId: number,
         factsMethodCode: string,
         labGroupFactsParentOrgName: string
      )
      : Observable<MicrobiologySampleAnalysisSubmissionResponse>
   {
      const vidasData = testData.vidasData;
      const samplingMethod = testData.preEnrData.samplingMethod;

      if ( samplingMethod.testUnitsType == null || samplingMethod.testUnitsCount <= 0 )
         return throwError('sampling method data is not complete');

      const positivesCount = countValueOccurrences(vidasData.testUnitDetections, true);

      const spiking = vidasData.spikeDetection != null;

      const structuredRemarks = {
         methodRemarks: vidasData.methodRemarks,
         methodDetails: {
            gramsPerSub: samplingMethod.extractedGramsPerSub
         },
      };

      const subm: MicrobiologySampleAnalysis = {
         operationId: opId,
         accomplishingOrgName: labGroupFactsParentOrgName,
         actionIndicator: positivesCount > 0 ? 'Y' : 'N',
         problemCode: 'MICROID',
         genusCode: 'SLML',
         speciesCode: 'SLML998',
         methodSourceCode: 'AOAC',
         methodCode: factsMethodCode,
         methodModificationIndicator: 'N',
         kitTestIndicator: spiking ? 'Y' : 'N',
         quantifiedIndicator: 'N',
         examinedType: samplingMethod.testUnitsType.toUpperCase() + 'S',
         analysisResultsRemarksText: JSON.stringify(structuredRemarks),
      };

      // Set any remaining fields having conditional presence.

      if ( samplingMethod.testUnitsType === 'composite' )
      {
         subm.compositesExaminedNumber = samplingMethod.testUnitsCount;
         subm.subSamplesUsedCompositeNumber = samplingMethod.numberOfSubsPerComposite;
         subm.compositesDetectableFindingsNumber = positivesCount;
      }
      else
      {
         subm.subSamplesExaminedNumber = samplingMethod.testUnitsCount;
         subm.subSamplesDetectableFindingsNumber = positivesCount;
      }

      if ( spiking )
      {
         /* TODO: Add kit test structure representing spiking results (need example or struct def).
            Sub/Comp #: Which sub/comp was used for spiking
              Field name for this? Where to get this from?
            Rapid Method Results (Vidas) = POS/NEG
            Conventional Method Results = NA (since Vidas is always done prior to conventional methods)
            Spike Results: POS/NEG
            Genus/Species Used for Spike: S. cerro for ARL, may vary by lab
              Genus code good enough here or genus/species text (or both)?
            Kit compare remarks: text describing results, for ARL something like "7 CFUs on blood agar"
          */

      }

      return (
         this.httpClient.post<MicrobiologySampleAnalysisSubmissionResponse>(
            this.apiUrlsSvc.factsMicrobiologySampleAnalysisUrl(),
            subm
         )
      );
   }

   submitBAMAnalysisResults
      (
         testData: TestData,
         opId: number,
         labGroupFactsParentOrgName: string
      )
      : Observable<MicrobiologySampleAnalysisSubmissionResponse>
   {
      const samplingMethod = testData.preEnrData.samplingMethod;

      const examinedNumber = countValueOccurrences(testData.vidasData.testUnitDetections, true);

      const bamFindings = this.makeBAMFindings(testData.posContData.testUnitsContinuationTests);

      const detectableFindingsNumber = bamFindings.filter(fdg => fdg.presenceResultIndicator === 'POS').length;

      const subm: MicrobiologySampleAnalysis = {
         operationId: opId,
         accomplishingOrgName: labGroupFactsParentOrgName,
         actionIndicator: 'Y',
         problemCode: 'MICROID',
         genusCode: 'SLML',
         speciesCode: 'SLML998',
         methodSourceCode: 'BAM',
         methodCode: 'B160',
         methodModificationIndicator: 'N',
         kitTestIndicator: 'N',
         quantifiedIndicator: 'N',
         examinedType: samplingMethod.testUnitsType.toUpperCase() + 'S',
         analysisMicFindings: bamFindings,
         analysisResultsRemarksText: testData.wrapupData.analysisResultsRemarksText,
      };

      // Set any remaining fields having conditional presence.

      if ( samplingMethod.testUnitsType === 'composite' )
      {
         subm.compositesExaminedNumber = examinedNumber;
         subm.subSamplesUsedCompositeNumber = samplingMethod.numberOfSubsPerComposite;
         subm.compositesDetectableFindingsNumber = detectableFindingsNumber;
      }
      else
      {
         subm.subSamplesExaminedNumber = examinedNumber;
         subm.subSamplesDetectableFindingsNumber = detectableFindingsNumber;
      }

      return (
         this.httpClient.post<MicrobiologySampleAnalysisSubmissionResponse>(
            this.apiUrlsSvc.factsMicrobiologySampleAnalysisUrl(),
            subm
         )
      );
   }

   private makeBAMFindings
      (
         continuationTestsByTestUnitNum: ContinuationTestssByTestUnitNum
      )
      : MicrobiologyAnalysisFinding[]
   {
      const res: MicrobiologyAnalysisFinding[] = [];

      /* TODO
           How to determine pos/neg from identification text or codes? Recognize specific API/Vitek codes?
           Should failed (negative or low confidence/unclear) identifications be reported?  How?
       */

      for ( const testUnitNum of Object.keys(continuationTestsByTestUnitNum) )
      {
         // TODO: Can have multiple identifications here by source media(2) and selective agar(4), how to determine single identification?
         //       If any firm identification exists under any of these should it be reported as positive?
         //       What if multiple firm identifications exist?
         const contTests = continuationTestsByTestUnitNum[testUnitNum];
         const rvTests = contTests.rvSourcedTests;
         const ttTests = contTests.ttSourcedTests;
         // TODO: Add to result array when above problems are resolved.
      }

      return res;
         // {
         //    'actionIndicator': 'Y',
         //    // TODO: Is this the original test unit number (as numbered in Vidas results)? (Inappropriate field name if so.)
         //    //       Really string not numeric?
         //    'subNumberCode': '1',
         //    'genusCode': 'SLML',      // sch - why necessary again here?
         //    'speciesCode': 'SLML998', // '
         //    'presenceResultIndicator': 'POS', // TODO: Where from? Would a negative have an array entry at all?
         //    'atypicalReactionCode': 'N',      // TODO: Where from?
         //    'isolatesSentNumber': 1,          // TODO: Where from?
         //    'fdaLabOrganizationId': 3004,     // TODO: Why not org name as elsewhere?
         //    'isolatesSentIndicator': 'Y',     // TODO: Where from?
         //    'remarksText': 'Remarks 1',       // TODO: Where from?
         //    'secondaryPafCode': 'SAL',
         //    // 'sampleAnalysisMicrobes': [] // TODO: What is this?
         // }
   }

   setSampleOperationWorkStatus(sampleOpId: number, statusCode: string, factsPersonId: number): Observable<void>
   {
      const url = this.apiUrlsSvc.factsSampleOpWorkStatusUrl(sampleOpId, factsPersonId);
      return this.httpClient.post<void>(url, statusCode);
   }
}
