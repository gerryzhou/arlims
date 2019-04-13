import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {
   MicrobiologyAnalysisFinding,
   MicrobiologySampleAnalysis,
   CreatedSampleAnalysisMicrobiology,
   MicrobiologyKitTest
} from '../../../../generated/dto';
import {
   ContinuationTestssByTestUnitNum,
   getTestMediumBatchIds,
   TestData,
   vidasDaysElapsedFromSampleReceipt
} from './test-data';
import {countValueOccurrences} from '../../test-stages';
import {ApiUrlsService, UserContextService} from '../../../shared/services';

// FACTS posting service for the salmonella module.
@Injectable()
export class SalmonellaFactsService {

   constructor
      (
         private usrCtxSvc: UserContextService,
         private apiUrlsSvc: ApiUrlsService,
         private httpClient: HttpClient
      )
   {}

   submitAnalyses
      (
         testData: TestData,
         opId: number,
         factsMethodCode: string,
         labGroupFactsParentOrgName: string
      )
      : Observable<[CreatedSampleAnalysisMicrobiology]>
   {
      // TODO: Enable BAM submission here.
      const analyses = [
         this.makeAOACSampleAnalysis(testData, opId, factsMethodCode, labGroupFactsParentOrgName),
         // this.makeBAMSampleAnalysis(testData, opId, labGroupFactsParentOrgName) // TODO
      ];

      return (
         this.httpClient.post<[CreatedSampleAnalysisMicrobiology]>(
            this.apiUrlsSvc.factsMicrobiologySampleAnalysesUrl(),
            analyses
         )
      );
   }

   private makeAOACSampleAnalysis
      (
         testData: TestData,
         opId: number,
         factsMethodCode: string,
         labGroupFactsParentOrgName: string
      )
      : MicrobiologySampleAnalysis
   {
      const vidasData = testData.vidasData;
      const samplingMethod = testData.preEnrData.samplingMethod;

      const positivesCount = countValueOccurrences(vidasData.testUnitDetections, true);

      const spiking = vidasData.spikeDetection != null;
      const spikeSpecies = spiking ? testData.preEnrData.spikeSpeciesText : null;
      const kitRemarks = spiking ? testData.preEnrData.spikeKitRemarksText : null;
      const analysisMicKitTests = spiking ?
         this.makeSpikingKitTests(testData.vidasData.spikeDetection, spikeSpecies, kitRemarks, positivesCount, 'NA')
         : null;

      const vidasDaysFromReceipt = vidasDaysElapsedFromSampleReceipt(testData);
      const lotCodes = getTestMediumBatchIds(testData);

      const structuredRemarks = {
         methodRemarks: vidasData.methodRemarks,
         methodDetails: {
            vidasDaysFromReceipt,
            lotCodes,
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
         lowestDilutionTestedCode: '1', // TODO: Where should this come from?
         quantifiedIndicator: 'N',
         subSamplesDetectableFindingsNumber: positivesCount,
         analysisMicKitTests,
         analysisMicFindings: [],
         analysisResultsRemarksText: JSON.stringify(structuredRemarks),
      };

      // Set any remaining fields having conditional presence.

      if ( samplingMethod.testUnitsType === 'composite' )
      {
         subm.compositesExaminedNumber = samplingMethod.testUnitsCount;
         subm.subSamplesUsedCompositeNumber = samplingMethod.numberOfSubsPerComposite;
      }
      else
      {
         subm.subSamplesExaminedNumber = samplingMethod.testUnitsCount;
      }

      return subm;
   }

   private makeBAMSampleAnalysis
      (
         testData: TestData,
         opId: number,
         labGroupFactsParentOrgName: string
      )
      : MicrobiologySampleAnalysis
   {
      const samplingMethod = testData.preEnrData.samplingMethod;

      const examinedNumber = countValueOccurrences(testData.vidasData.testUnitDetections, true);

      const bamFindings = this.makeBAMFindings(testData.posContData.testUnitsContinuationTests || {});

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
         lowestDilutionTestedCode: '1',
         quantifiedIndicator: 'N',
         analysisMicFindings: bamFindings,
         subSamplesDetectableFindingsNumber: detectableFindingsNumber,
         analysisResultsRemarksText: testData.wrapupData.analysisResultsRemarksText,
      };

      // Set any remaining fields having conditional presence.

      if ( samplingMethod.testUnitsType === 'composite' )
      {
         subm.compositesExaminedNumber = examinedNumber;
         subm.subSamplesUsedCompositeNumber = samplingMethod.numberOfSubsPerComposite;
      }
      else
      {
         subm.subSamplesExaminedNumber = examinedNumber;
      }

      return subm;
   }

   private makeSpikingKitTests
      (
         detection: boolean,
         speciesText: string | null,
         kitRemarks: string | null,
         rapidMethodDetections: number,
         conventionalMethodResultCode: string
      )
      : MicrobiologyKitTest[]
   {
      return [
         {
            conventionalMethodResultCode,

            rapidMethodResultCode: rapidMethodDetections > 0 ? 'POS' : 'NEG',

            spikingGenusSpeciesText: speciesText,

            spikingResultCode: detection ? 'POS' : 'NEG',

            subsampleNumberCode: '1', // TODO: Where from?

            selectiveAgarResultCode: '', // TODO: Where from? Really empty text when missing, not null or absence?

            selectiveAgarText: '',       // TODO: "

            kitRemarksText: kitRemarks || 'NA'
         }
      ];
   }

   private makeBAMFindings
      (
         continuationTestsByTestUnitNum: ContinuationTestssByTestUnitNum
      )
      : MicrobiologyAnalysisFinding[]
   {
      const res: MicrobiologyAnalysisFinding[] = [];

      for ( const testUnitNum of Object.keys(continuationTestsByTestUnitNum) )
      {
         const contTests = continuationTestsByTestUnitNum[testUnitNum];
         const rvTests = contTests.rvSourcedTests;
         const ttTests = contTests.ttSourcedTests;

         // TODO: Consider a test unit positive if any isolate yields conclusive positive result.
         //       (Add test data function to find if any isolates have positive identifications.)
         //       How to determine pos/neg from identification text or codes? Recognize specific API/Vitek codes?
         //       Add to result array when above problems are resolved.
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

}
