import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {
   TestData,
   PrepData,
   PreEnrData,
   SelEnrData,
   MBrothData,
   VidasData,
   WrapupData,
   PositivesContinuationData,
   ContinuationControls,
   ContinuationTests,
   ContinuationTestssByTestUnitNum,
   makeEmptyContinuationControls,
   SlantTubeTest,
   IsolateIdentification,
   IsolateTestSequence,
   IsolateTestSequenceFailure,
   IsolateTestSequencesByUid,
   SelectiveAgarsTestSuite,
   TimeChargesSet,
   TimeCharge,
   FactsSubmissionResultsByType,
} from './test-data';
import {TestConfig} from '../test-config';
import {SamplingMethod} from '../../sampling-methods';
import {FactsSubmissionResult} from '../../../../shared/client-models/facts-submission-result-types';

type FormModel<T> = { [P in keyof T]: any };

export function makeFormGroup<T>
   (
      fb: FormBuilder,
      formModel: FormModel<T>,
      validators: any[] | null = null
   )
   : FormGroup
{
   return ( validators != null ) ? fb.group(formModel, {validators: validators}) : fb.group(formModel);
}

export function makeTestDataFormGroup
   (
      testData: TestData,
      username: string,
      testConfig: TestConfig | null
   )
   : FormGroup
{
   const fb = new FormBuilder();

   function formGroup<T>(formModel: FormModel<T>, validators: any[] | null = null): FormGroup
   {
      return makeFormGroup(fb, formModel, validators);
   }

   return formGroup<TestData>({

      prepData: formGroup<PrepData>({
         sampleReceivedDate: [testData.prepData.sampleReceivedDate],
         sampleReceivedDateEntered: [testData.prepData.sampleReceivedDateEntered],
         sampleReceivedFrom: [testData.prepData.sampleReceivedFrom],
         descriptionMatchesCR: [testData.prepData.descriptionMatchesCR],
         descriptionMatchesCRNotes: [testData.prepData.descriptionMatchesCRNotes],
         labelAttachmentType: [testData.prepData.labelAttachmentType],
         containerMatchesCR: [testData.prepData.containerMatchesCR],
         containerMatchesCRNotes: [testData.prepData.containerMatchesCRNotes],
         codeMatchesCR: [testData.prepData.codeMatchesCR],
         codeMatchesCRNotes: [testData.prepData.codeMatchesCRNotes],
      }),

      preEnrData: formGroup<PreEnrData>({
         samplingMethod: formGroup<SamplingMethod>({
            testUnitsType: [testData.preEnrData.samplingMethod.testUnitsType],
            testUnitsCount: [testData.preEnrData.samplingMethod.testUnitsCount],
            extractedGramsPerSub: [testData.preEnrData.samplingMethod.extractedGramsPerSub],
            numberOfSubsPerComposite: [testData.preEnrData.samplingMethod.numberOfSubsPerComposite],
            userModifiable: [testData.preEnrData.samplingMethod.userModifiable || false],
         }),
         samplingMethodExceptionsNotes: [testData.preEnrData.samplingMethodExceptionsNotes],
         balanceId: [testData.preEnrData.balanceId],
         blenderJarId: [testData.preEnrData.blenderJarId],
         bagId: [testData.preEnrData.bagId],
         mediumBatchId: [testData.preEnrData.mediumBatchId],
         mediumType: [testData.preEnrData.mediumType],
         incubatorId: [testData.preEnrData.incubatorId],
         sampleSpike: [testData.preEnrData.sampleSpike],
         spikeSpeciesText: [testData.preEnrData.spikeSpeciesText || testConfig.spikeSpeciesText || null],
         spikeKitRemarksText: [testData.preEnrData.spikeKitRemarksText || testConfig.spikeKitRemarksText || null]
      }),

      selEnrData: formGroup<SelEnrData>({
         rvBatchId: [testData.selEnrData.rvBatchId],
         ttBatchId: [testData.selEnrData.ttBatchId],
         bgBatchId: [testData.selEnrData.bgBatchId],
         i2kiBatchId: [testData.selEnrData.i2kiBatchId],
         spikePlateCount: [testData.selEnrData.spikePlateCount],
         rvttWaterBathId: [testData.selEnrData.rvttWaterBathId],
         positiveControlGrowth: [testData.selEnrData.positiveControlGrowth],
         mediumControlGrowth: [testData.selEnrData.mediumControlGrowth],
         systemControlsGrowth: [testData.selEnrData.systemControlsGrowth],
         systemControlTypes: [testData.selEnrData.systemControlTypes],
         collectorControlsGrowth: [testData.selEnrData.collectorControlsGrowth],
         collectorControlTypes: [testData.selEnrData.collectorControlTypes],
         bacterialControlsUsed: [testData.selEnrData.bacterialControlsUsed],
      }),

      mBrothData: formGroup<MBrothData>({
         mBrothBatchId: [testData.mBrothData.mBrothBatchId],
         mBrothWaterBathId: [testData.mBrothData.mBrothWaterBathId],
         waterBathStarted: [testData.mBrothData.waterBathStarted],
      }),

      vidasData: formGroup<VidasData>({
         instrumentId: [testData.vidasData.instrumentId],
         kitIds: [testData.vidasData.kitIds],
         testUnitDetections: new FormArray(
            (testData.vidasData.testUnitDetections || [null]).map(detected => new FormControl(detected))
         ),
         positiveControlDetection: [testData.vidasData.positiveControlDetection],
         positiveControlDetectionEntered: [testData.vidasData.positiveControlDetectionEntered],
         mediumControlDetection: [testData.vidasData.mediumControlDetection],
         spikeDetection: [testData.vidasData.spikeDetection],
         methodRemarks: [testData.vidasData.methodRemarks],
      }),

      posContData: makePositivesContinuationDataFormGroup(fb, testData.posContData),

      wrapupData: formGroup<WrapupData>({
         reserveSampleDisposition: [testData.wrapupData.reserveSampleDisposition],
         reserveSampleDestinations: [testData.wrapupData.reserveSampleDestinations],
         reserveSampleOtherDescription: [testData.wrapupData.reserveSampleOtherDescription],
         testTimeCharges: makeTimeChargesSetFormGroup(fb, testData.wrapupData.testTimeCharges),
         timeChargesLastSavedToFacts: [testData.wrapupData.timeChargesLastSavedToFacts],
         timeChargesLastEdited: [testData.wrapupData.timeChargesLastEdited],
         analysisResultsRemarksText: [testData.wrapupData.analysisResultsRemarksText],
      }),
      factsSubmissionsResults: makeFactsAnalysisSubmissionResultsFormGroup(fb, testData.factsSubmissionsResults),
   });
}

export function makePositivesContinuationDataFormGroup
   (
      formBuilder: FormBuilder,
      posContData: PositivesContinuationData
   )
   : FormGroup
{
   if ( posContData.continuationControls == null && posContData.testUnitsContinuationTests == null )
      return new FormGroup({});
   else
   {
      const contTests = posContData.testUnitsContinuationTests || {};
      const contControls = posContData.continuationControls || makeEmptyContinuationControls();

      return makeFormGroup<PositivesContinuationData>(formBuilder, {
         testUnitsContinuationTests: makeTestUnitsContinuationTestsFormGroup(formBuilder, contTests),
         continuationControls: makeContinuationControlsFormGroup(formBuilder, contControls)
      });
   }
}

export function makeTestUnitsContinuationTestsFormGroup
   (
      formBuilder: FormBuilder,
      testUnitsContinuationTests: ContinuationTestssByTestUnitNum
   )
   : FormGroup
{
   const fgControls: {[testUnitNum: string]: FormGroup} = {};

   for ( const testUnitNumStr of Object.keys(testUnitsContinuationTests) )
      fgControls[testUnitNumStr] =
         makeContinuationTestsFormGroup(formBuilder, testUnitsContinuationTests[testUnitNumStr]);

   return new FormGroup(fgControls);
}

// Make continuation testing form group for one test unit.
export function makeContinuationTestsFormGroup
   (
      formBuilder: FormBuilder,
      contTests: ContinuationTests
   )
   : FormGroup
{
   return makeFormGroup<ContinuationTests>(formBuilder, {
      rvSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(formBuilder, contTests.rvSourcedTests),
      ttSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(formBuilder, contTests.ttSourcedTests),
   });
}

export function makeContinuationControlsFormGroup
   (
      formBuilder: FormBuilder,
      contControls: ContinuationControls
   )
   : FormGroup
{
   return makeFormGroup<ContinuationControls>(formBuilder, {
      salmonellaGaminara: makeSelectiveAgarsTestSuiteFormGroup(formBuilder, contControls.salmonellaGaminara),
      salmonellaGaminaraSatisfactory: [contControls.salmonellaGaminaraSatisfactory],
      salmonellaDiarizonae: makeSelectiveAgarsTestSuiteFormGroup(formBuilder, contControls.salmonellaDiarizonae),
      salmonellaDiarizonaeSatisfactory: [contControls.salmonellaDiarizonaeSatisfactory],
      pVulgarisUreaDetection: [contControls.pVulgarisUreaDetection],
      pVulgarisIdentification: makeIsolateIdentificationFormGroup(formBuilder, contControls.pVulgarisIdentification),
      pVulgarisSatisfactory: [contControls.pVulgarisSatisfactory],
      pAerugiOxidaseDetection: [contControls.pAerugiOxidaseDetection],
      pAerugiSatisfactory: [contControls.pAerugiSatisfactory],
      mediumControlGrowth: [contControls.mediumControlGrowth],
      mediumSatisfactory: [contControls.mediumSatisfactory],
   });
}

function makeSelectiveAgarsTestSuiteFormGroup
   (
      formBuilder: FormBuilder,
      selAgarsTestSuite: SelectiveAgarsTestSuite
   )
   : FormGroup
{
   return makeFormGroup<SelectiveAgarsTestSuite>(formBuilder, {
      he: makeIsolatesTestSequencesFormGroup(formBuilder, selAgarsTestSuite.he),
      xld: makeIsolatesTestSequencesFormGroup(formBuilder, selAgarsTestSuite.xld),
      bs24h: makeIsolatesTestSequencesFormGroup(formBuilder, selAgarsTestSuite.bs24h),
      bs48h: makeIsolatesTestSequencesFormGroup(formBuilder, selAgarsTestSuite.bs48h),
   });
}

function makeIsolatesTestSequencesFormGroup
   (
      formBuilder: FormBuilder,
      isolateTestSeqsByUid: IsolateTestSequencesByUid
   )
   : FormGroup
{
   const fgControls: { [testSeqUid: string]: FormGroup } = {};

   for ( const testSeqUid of Object.keys(isolateTestSeqsByUid) )
      fgControls[testSeqUid] = makeIsolateTestSequenceFormGroup(formBuilder, isolateTestSeqsByUid[testSeqUid]);

   return new FormGroup(fgControls);
}

export function makeIsolateTestSequenceFormGroup
   (
      formBuilder: FormBuilder,
      isolateTestSeq: IsolateTestSequence
   )
   : FormGroup
{
   const fg = makeFormGroup<IsolateTestSequence>(formBuilder, {
      isolateNumber: [isolateTestSeq.isolateNumber],
      colonyAppearance: [isolateTestSeq.colonyAppearance],
      tsiTubeTest: makeSlantTubeTestFormGroup(formBuilder, isolateTestSeq.tsiTubeTest),
      liaTubeTest: makeSlantTubeTestFormGroup(formBuilder, isolateTestSeq.liaTubeTest),
      ureaDetection: [isolateTestSeq.ureaDetection],
      oxidaseDetection: [isolateTestSeq.oxidaseDetection],
      // 'identification' and 'failure' FormGroups are added below or interactively as needed
   });

   if ( isolateTestSeq.identification != null )
      fg.addControl('identification', makeIsolateIdentificationFormGroup(formBuilder, isolateTestSeq.identification));
   if ( isolateTestSeq.failure != null )
      fg.addControl('failure', makeIsolateTestSequenceFailureFormGroup(formBuilder, isolateTestSeq.failure));

   return fg;
}

function makeSlantTubeTestFormGroup
   (
      formBuilder: FormBuilder,
      slantTubeTest: SlantTubeTest
   )
   : FormGroup
{
   return makeFormGroup<SlantTubeTest>(formBuilder, {
      slant: [slantTubeTest.slant],
      butt: [slantTubeTest.butt],
      h2s: [slantTubeTest.h2s],
      gas: [slantTubeTest.gas],
   });
}

export function makeEmptyIsolateIdentificationFormGroup(): FormGroup
{
   return makeIsolateIdentificationFormGroup(new FormBuilder(), null);
}

export function makeIsolateIdentificationFormGroup
   (
      formBuilder: FormBuilder,
      isolateIdent: IsolateIdentification
   )
   : FormGroup
{
   return makeFormGroup<IsolateIdentification>(formBuilder, {
      method:    [isolateIdent && isolateIdent.method || null],
      identCode: [isolateIdent && isolateIdent.identCode || null],
      identText: [isolateIdent && isolateIdent.identText || null],
      attachmentLabel: [isolateIdent && isolateIdent.attachmentLabel || null],
   });
}

export function makeIsolateTestSequenceFailureFormGroup
   (
      formBuilder: FormBuilder,
      failure: IsolateTestSequenceFailure
   )
{
   return makeFormGroup<IsolateTestSequenceFailure>(formBuilder, {
      declaredAt: [failure.declaredAt],
      reason: [failure.reason],
      notes: [failure.notes],
   });
}

function makeTimeChargesSetFormGroup
   (
      formBuilder: FormBuilder,
      testTimeCharges: TimeChargesSet | null
   )
   : FormGroup
{
   const fgControls: { [userShortName: string]: FormGroup } = {};

   if ( testTimeCharges )
   {
      for ( const userShortName of Object.keys(testTimeCharges) )
         fgControls[userShortName] = makeTimeChargeFormGroup(formBuilder, testTimeCharges[userShortName]);
   }

   return new FormGroup(fgControls);
}

export function makeTimeChargeFormGroup
   (
      formBuilder: FormBuilder,
      timeCharge: TimeCharge
   )
   : FormGroup
{
   return makeFormGroup<TimeCharge>(formBuilder, {
      role: [timeCharge.role],
      assignmentStatus: [timeCharge.assignmentStatus],
      hours: [timeCharge.hours],
      enteredTimestamp: [timeCharge.enteredTimestamp],
   });
}

export function makeFactsAnalysisSubmissionResultsFormGroup
   (
      formBuilder: FormBuilder,
      submResultsByType: FactsSubmissionResultsByType
   )
   : FormGroup
{
   const fgControls: { [submType: string]: FormGroup } = {};

   if ( submResultsByType )
   {
      for ( const submType of Object.keys(submResultsByType) )
      {
         fgControls[submType] = makeFactsSubmissionResultFormGroup(formBuilder, submResultsByType[submType]);
      }
   }

   return new FormGroup(fgControls);
}

export function makeFactsSubmissionResultFormGroup
   (
      formBuilder: FormBuilder,
      res: FactsSubmissionResult
   )
   : FormGroup
{
   return makeFormGroup<FactsSubmissionResult>(formBuilder, {
      submissionTimestamp: [res.submissionTimestamp],
      submissionSucceeded: [res.submissionSucceeded],
      failureMessage: [res.failureMessage],
   });
}
