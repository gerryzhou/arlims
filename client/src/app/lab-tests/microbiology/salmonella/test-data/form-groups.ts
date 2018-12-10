import {FormArray, FormControl, FormGroup} from '@angular/forms';

import {
   ContinuationControls,
   ContinuationTests,
   ContinuationTestssByTestUnitNum, IsolateIdentification, IsolateTestSequence, IsolateTestSequenceFailure, IsolateTestSequencesByUid,
   makeEmptyContinuationControls,
   PositivesContinuationData, SelectiveAgarsTestSuite, SlantTubeTest,
   TestData
} from './types';
import {makeTestTimeChargesFormGroup} from '../../../../shared/models/time-charges';

export function makeTestDataFormGroup(testData: TestData, username: string): FormGroup
{
   return new FormGroup({
      prepData: new FormGroup({
         sampleReceivedDate: new FormControl(testData.prepData.sampleReceivedDate),
         sampleReceivedFrom: new FormControl(testData.prepData.sampleReceivedFrom),
         descriptionMatchesCR: new FormControl(testData.prepData.descriptionMatchesCR),
         descriptionMatchesCRNotes: new FormControl(testData.prepData.descriptionMatchesCRNotes),
         labelAttachmentType: new FormControl(testData.prepData.labelAttachmentType),
         containerMatchesCR: new FormControl(testData.prepData.containerMatchesCR),
         containerMatchesCRNotes: new FormControl(testData.prepData.containerMatchesCRNotes),
         codeMatchesCR: new FormControl(testData.prepData.codeMatchesCR),
         codeMatchesCRNotes: new FormControl(testData.prepData.codeMatchesCRNotes),
      }),
      preEnrData: new FormGroup({
         samplingMethod: new FormGroup({
            numberOfComposites: new FormControl(testData.preEnrData.samplingMethod.numberOfComposites),
            numberOfSubsPerComposite: new FormControl(testData.preEnrData.samplingMethod.numberOfSubsPerComposite),
            extractedGramsPerSub: new FormControl(testData.preEnrData.samplingMethod.extractedGramsPerSub),
            numberOfSubs: new FormControl(testData.preEnrData.samplingMethod.numberOfSubs),
            compositeMassGrams: new FormControl(testData.preEnrData.samplingMethod.compositeMassGrams),
            userModifiable: new FormControl(testData.preEnrData.samplingMethod.userModifiable || false),
         }),
         samplingMethodExceptionsNotes: new FormControl(testData.preEnrData.samplingMethodExceptionsNotes),

         balanceId: new FormControl(testData.preEnrData.balanceId),
         blenderJarId: new FormControl(testData.preEnrData.blenderJarId),
         bagId: new FormControl(testData.preEnrData.bagId),
         mediumBatchId: new FormControl(testData.preEnrData.mediumBatchId),
         mediumType: new FormControl(testData.preEnrData.mediumType),
         incubatorId: new FormControl(testData.preEnrData.incubatorId),

         sampleSpike: new FormControl(testData.preEnrData.sampleSpike),
      }),
      selEnrData: new FormGroup({
         rvBatchId: new FormControl(testData.selEnrData.rvBatchId),
         ttBatchId: new FormControl(testData.selEnrData.ttBatchId),
         bgBatchId: new FormControl(testData.selEnrData.bgBatchId),
         i2kiBatchId: new FormControl(testData.selEnrData.i2kiBatchId),
         spikePlateCount: new FormControl(testData.selEnrData.spikePlateCount),
         rvttWaterBathId: new FormControl(testData.selEnrData.rvttWaterBathId),
         positiveControlGrowth: new FormControl(testData.selEnrData.positiveControlGrowth),
         mediumControlGrowth: new FormControl(testData.selEnrData.mediumControlGrowth),
         systemControlsGrowth: new FormControl(testData.selEnrData.systemControlsGrowth),
         systemControlTypes: new FormControl(testData.selEnrData.systemControlTypes),
         collectorControlsGrowth: new FormControl(testData.selEnrData.collectorControlsGrowth),
         collectorControlTypes: new FormControl(testData.selEnrData.collectorControlTypes),
         bacterialControlsUsed: new FormControl(testData.selEnrData.bacterialControlsUsed),
      }),
      mBrothData: new FormGroup({
         mBrothBatchId: new FormControl(testData.mBrothData.mBrothBatchId),
         mBrothWaterBathId: new FormControl(testData.mBrothData.mBrothWaterBathId),
         waterBathStarted: new FormControl(testData.mBrothData.waterBathStarted),
      }),
      vidasData: new FormGroup({
         instrumentId: new FormControl(testData.vidasData.instrumentId),
         kitIds: new FormControl(testData.vidasData.kitIds),
         testUnitDetections: new FormArray(
            (testData.vidasData.testUnitDetections || [null])
               .map(detected => new FormControl(detected))
         ),
         positiveControlDetection: new FormControl(testData.vidasData.positiveControlDetection),
         mediumControlDetection: new FormControl(testData.vidasData.mediumControlDetection),
         spikeDetection: new FormControl(testData.vidasData.spikeDetection),
      }),
      posContData: makePositivesContinuationDataFormGroup(testData.posContData, username),
      wrapupData: new FormGroup({
         reserveSampleDisposition: new FormControl(testData.wrapupData.reserveSampleDisposition),
         reserveSampleDestinations: new FormControl(testData.wrapupData.reserveSampleDestinations),
         reserveSampleOtherDescription: new FormControl(testData.wrapupData.reserveSampleOtherDescription),
         testTimeCharges: makeTestTimeChargesFormGroup(testData.wrapupData.testTimeCharges),
      }),
   });
}

export function makePositivesContinuationDataFormGroup(posContData: PositivesContinuationData | null, username: string): FormGroup
{
   const formValidatorFunctions = [];  // Put form-level validation here if any.

   if ( posContData == null )
      return new FormGroup({}, formValidatorFunctions);

   const testUnitsContinuationTests =
      makeTestUnitsContinuationTestsFormGroup(posContData.testUnitsContinuationTests || {});

   const continuationControls =
      makeContinuationControlsFormGroup(posContData.continuationControls || makeEmptyContinuationControls(username));

   return new FormGroup(
      {
         testUnitsContinuationTests,
         continuationControls
      },
      formValidatorFunctions
   );
}

export function makeTestUnitsContinuationTestsFormGroup(testUnitsContinuationTests: ContinuationTestssByTestUnitNum): FormGroup
{
   const fgControls: {[testUnitNum: string]: FormGroup} = {};

   for ( const testUnitNumStr of Object.keys(testUnitsContinuationTests) )
      fgControls[testUnitNumStr] = makeContinuationTestsFormGroup(testUnitsContinuationTests[testUnitNumStr]);

   return new FormGroup(fgControls);
}

// Make continuation testing form group for one test unit.
export function makeContinuationTestsFormGroup(contTests: ContinuationTests): FormGroup
{
   return new FormGroup({
      rvSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(contTests.rvSourcedTests),
      ttSourcedTests: makeSelectiveAgarsTestSuiteFormGroup(contTests.ttSourcedTests),
   });
}

export function makeContinuationControlsFormGroup(contControls: ContinuationControls): FormGroup
{
   return new FormGroup({
      salmonellaGaminara: makeSelectiveAgarsTestSuiteFormGroup(contControls.salmonellaGaminara),
      salmonellaGaminaraSatisfactory: new FormControl(contControls.salmonellaGaminaraSatisfactory),
      salmonellaDiarizonae: makeSelectiveAgarsTestSuiteFormGroup(contControls.salmonellaDiarizonae),
      salmonellaDiarizonaeSatisfactory: new FormControl(contControls.salmonellaDiarizonaeSatisfactory),
      pVulgarisUreaDetection: new FormControl(contControls.pVulgarisUreaDetection),
      pVulgarisIdentification: makeIsolateIdentificationFormGroup(contControls.pVulgarisIdentification),
      pVulgarisSatisfactory: new FormControl(contControls.pVulgarisSatisfactory),
      pAerugiOxidaseDetection: new FormControl(contControls.pAerugiOxidaseDetection),
      pAerugiSatisfactory: new FormControl(contControls.pAerugiSatisfactory),
      mediumControlGrowth: new FormControl(contControls.mediumControlGrowth),
      mediumSatisfactory: new FormControl(contControls.mediumSatisfactory),
   });
}

function makeSelectiveAgarsTestSuiteFormGroup(selAgarsTestSuite: SelectiveAgarsTestSuite): FormGroup
{
   return new FormGroup({
      he: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.he),
      xld: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.xld),
      bs24h: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.bs24h),
      bs48h: makeIsolatesTestSequencesFormGroup(selAgarsTestSuite.bs48h),
   });
}

function makeIsolatesTestSequencesFormGroup(isolateTestSeqsByUid: IsolateTestSequencesByUid): FormGroup
{
   const fgControls: { [testSeqUid: string]: FormGroup } = {};

   for ( const testSeqUid of Object.keys(isolateTestSeqsByUid) )
      fgControls[testSeqUid] = makeIsolateTestSequenceFormGroup(isolateTestSeqsByUid[testSeqUid]);

   return new FormGroup(fgControls);
}

export function makeIsolateTestSequenceFormGroup(isolateTestSeq: IsolateTestSequence): FormGroup
{
   const fg = new FormGroup({
      isolateNumber: new FormControl(isolateTestSeq.isolateNumber),
      colonyAppearance: new FormControl(isolateTestSeq.colonyAppearance),
      tsiTubeTest: makeSlantTubeTestFormGroup(isolateTestSeq.tsiTubeTest),
      liaTubeTest: makeSlantTubeTestFormGroup(isolateTestSeq.liaTubeTest),
      ureaDetection: new FormControl(isolateTestSeq.ureaDetection),
      oxidaseDetection: new FormControl(isolateTestSeq.oxidaseDetection),
      // 'identification' and 'failure' FormGroups are added below or interactively as needed
   });

   if ( isolateTestSeq.identification != null )
      fg.addControl('identification', makeIsolateIdentificationFormGroup(isolateTestSeq.identification));
   if ( isolateTestSeq.failure != null )
      fg.addControl('failure', makeIsolateTestSequenceFailureFormGroup(isolateTestSeq.failure));

   return fg;
}

function makeSlantTubeTestFormGroup(slantTubeTest: SlantTubeTest): FormGroup
{
   return new FormGroup({
      slant: new FormControl(slantTubeTest.slant),
      butt: new FormControl(slantTubeTest.butt),
      h2s: new FormControl(slantTubeTest.h2s),
      gas: new FormControl(slantTubeTest.gas),
   });
}

export function makeEmptyIsolateIdentificationFormGroup(): FormGroup
{
   return makeIsolateIdentificationFormGroup(null);
}

export function makeIsolateIdentificationFormGroup(isolateIdent: IsolateIdentification): FormGroup
{
   return new FormGroup({
      method:    new FormControl(isolateIdent && isolateIdent.method || null),
      identCode: new FormControl(isolateIdent && isolateIdent.identCode || null),
      identText: new FormControl(isolateIdent && isolateIdent.identText || null),
      attachmentLabel: new FormControl(isolateIdent && isolateIdent.attachmentLabel || null),
      positive:  new FormControl(isolateIdent && isolateIdent.positive || null),
   });
}

export function makeIsolateTestSequenceFailureFormGroup(failure: IsolateTestSequenceFailure)
{
   return new FormGroup({
      declaredAt: new FormControl(failure.declaredAt),
      reason: new FormControl(failure.reason),
      notes: new FormControl(failure.notes),
   });
}

