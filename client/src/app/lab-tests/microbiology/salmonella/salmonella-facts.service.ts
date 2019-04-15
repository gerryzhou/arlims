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
   getTestMediumBatchIds, containsPositiveIdentification,
   TestData,
   vidasDaysElapsedFromSampleReceipt
} from './test-data';
import {countValueOccurrences} from '../../test-stages';
import {ApiUrlsService, UserContextService} from '../../../shared/services';
import {TestConfig} from './test-config';

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
         fdaOrgName: string,
         testConfig: TestConfig
      )
      : Observable<[CreatedSampleAnalysisMicrobiology]>
   {
      const aoacMethodCode = testConfig.aoacMethodCode;

      const analyses = [
         this.makeAOACSampleAnalysis(testData, opId, aoacMethodCode, fdaOrgName),
         this.makeBAMSampleAnalysis(testData, opId, fdaOrgName)
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
         methodCode: string,
         fdaOrgName: string
      )
      : MicrobiologySampleAnalysis
   {
      const vidasData = testData.vidasData;
      const samplingMethod = testData.preEnrData.samplingMethod;

      const positivesCount = countValueOccurrences(vidasData.testUnitDetections, true);

      const spiking = vidasData.spikeDetection != null;
      const spikeSpecies = spiking ? testData.preEnrData.spikeSpeciesText : null;
      const kitRemarks = spiking ? testData.preEnrData.spikeKitRemarksText : null;
      const analysisMicKitTests = !spiking ? null :
         this.makeSpikingKitTests(
            testData.vidasData.spikeDetection,
            spikeSpecies,
            kitRemarks,
            positivesCount,
            'NA' // conventional method (BAM) not performed yet at this (AOAC) stage
         );

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
         accomplishingOrgName: fdaOrgName,
         actionIndicator: positivesCount > 0 ? 'Y' : 'N',
         problemCode: 'MICROID',
         genusCode: 'SLML',
         speciesCode: 'SLML998',
         methodSourceCode: 'AOAC',
         methodCode: methodCode,
         methodModificationIndicator: 'N',
         kitTestIndicator: spiking ? 'Y' : 'N',
         lowestDilutionTestedCode: '1',
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
         fdaOrgName: string
      )
      : MicrobiologySampleAnalysis
   {
      const samplingMethod = testData.preEnrData.samplingMethod;

      const contTestsByTestUnitNum = testData.posContData.testUnitsContinuationTests || {};
      const examinedNumber = Object.keys(contTestsByTestUnitNum).length;
      const bamFindings = this.makeBAMFindings(contTestsByTestUnitNum, fdaOrgName);

      const positiveFindingsCount = bamFindings.filter(fdg => fdg.presenceResultIndicator === 'POS').length;

      const subm: MicrobiologySampleAnalysis = {
         operationId: opId,
         accomplishingOrgName: fdaOrgName,
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
         // TODO: Check that this is correct, which is currently counting positive
         //  test units having at least one isolate identification in IDENT stage.
         subSamplesDetectableFindingsNumber: positiveFindingsCount,
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

            // TODO: Meaning? Really the number of Vidas positives overall, or only for the test unit
            //       on which spiking was performed (subsampleNumberCode)?
            rapidMethodResultCode: rapidMethodDetections > 0 ? 'POS' : 'NEG',

            spikingGenusSpeciesText: speciesText,

            spikingResultCode: detection ? 'POS' : 'NEG',

            subsampleNumberCode: '1', // TODO: Where from? Need new field for this?
                                      // (no test unit in context here, this is at level of overall AOAC submission)

            selectiveAgarResultCode: '', // TODO: Where from? Really repr as empty text when missing, not null or absence?

            selectiveAgarText: '',       // TODO: "

            kitRemarksText: kitRemarks || 'NA'
         }
      ];
   }

   private makeBAMFindings
      (
         continuationTestsByTestUnitNum: ContinuationTestssByTestUnitNum,
         fdaOrgName: string
      )
      : MicrobiologyAnalysisFinding[]
   {
      const res: MicrobiologyAnalysisFinding[] = [];

      for ( const testUnitNum of Object.keys(continuationTestsByTestUnitNum) )
      {
         const contTests = continuationTestsByTestUnitNum[testUnitNum];

         const posIdent = containsPositiveIdentification(contTests);

         res.push({
            actionIndicator: posIdent ? 'Y' : 'N',
            subNumberCode: testUnitNum,
            genusCode: 'SLML',
            speciesCode: 'SLML998',
            secondaryPafCode: 'SAL',
            presenceResultIndicator: posIdent ? 'POS' : 'NEG',
            atypicalReactionCode: 'N',
            isolatesSentNumber: 1,              // TODO: Where from? Need new field for this?
            isolatesSentIndicator: 'Y',         // "
            fdaLabOrganizationName: fdaOrgName,
            remarksText: 'Test entry from ALIS' // "
         });

      }

      return res;
   }

}
