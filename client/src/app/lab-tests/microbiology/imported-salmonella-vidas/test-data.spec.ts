import {emptyTestData, getTestStageStatuses, TestData} from './test-data';

describe('microbiology imported salmonella vidas test data functions', () => {

   it('should yield empty for empty test data', () => {
      expect(getTestStageStatuses(emptyTestData()))
         .toEqual([
            {stageName: 'PREP', fieldValuesStatus: 'e'},
            {stageName: 'PRE-ENR', fieldValuesStatus: 'e'},
            {stageName: 'SEL-ENR', fieldValuesStatus: 'e'},
            {stageName: 'M-BROTH', fieldValuesStatus: 'e'},
            {stageName: 'VIDAS', fieldValuesStatus: 'e'},
            {stageName: 'CONTROLS', fieldValuesStatus: 'e'},
            {stageName: 'RESULTS', fieldValuesStatus: 'e'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'e'},
         ]);
   });

   it('should yield all complete for complete test data', () => {
      const sig =  {employeeShortName: 'SCH', signedInstant: '2/2/2T02:02:02'};

      const completeTestData: TestData = {
         prepData: {
            sampleReceived: '3/12/2010',
            sampleReceivedFrom: 'Scott',
            descriptionMatchesCR: true,
            labelAttachmentType: 'NONE',
            containerMatchesCR: true,
            containerMatchesCRSignature: sig,
            codeMatchesCR: true,
            codeMatchesCRSignature: sig,
         },
         preEnrData: {
            samplingMethod: {
               name: 'x',
               description: 'x',
               extractedGramsPerSub: 1,
               numberOfComposites: 1,
               compositeMassGrams: 1,
               numberOfSubsPerComposite: 1,
               numberOfSubs: 1,
            },
            balanceId: 'x',
            blenderJarId: 'x',
            bagId: 'x',
            sampleSpike: true,
            spikePlateCount: 1,
            preenrichMediumBatchId: 'x',
            preenrichIncubatorId: 'x',
            preenrichPositiveControlGrowth: true,
            preenrichMediumControlGrowth: true,
            preenrichSignature: sig,
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            bgBatchId: 'x',
            l2KiBatchId: 'x',
            rvttWaterBathId: 'x',
            rvttSignature: sig,
         },
         mBrothData: {
            mBrothBatchId: 'x',
            mBrothWaterBathId: 'x',
            mBrothSignature: sig,
         },
         vidasData: {
            vidasInstrumentId: 'x',
            vidasKitIds: ['x'],
            vidasCompositesDetections: [true],
            vidasPositiveControlDetection: true,
            vidasMediumControlDetection: false,
            vidasSpikeDetection: false,
            vidasSignature: sig,
         },
         controlsData: {
            systemControlsPositiveControlGrowth: true,
            systemMediumPositiveControlGrowth: false,
            systemControlsSignature: sig,
            collectorControlsPositveControlGrowth: true,
            collectorControlsMediumControlGrowth: false,
            collectorControlsSignature: sig,
            bacterialControlsUsed: false,
            bacterialControlsSignature: sig,
         },
         resultsData: {
            resultPositiveCompositesCount: 1,
            resultSignature: sig,
         },
         wrapupData: {
            reserveReserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            reserveSampleDestinations: ['x'],
            allCompletedSignature: sig,
         }
      };

      expect(getTestStageStatuses(completeTestData))
         .toEqual([
            {stageName: 'PREP', fieldValuesStatus: 'c'},
            {stageName: 'PRE-ENR', fieldValuesStatus: 'c'},
            {stageName: 'SEL-ENR', fieldValuesStatus: 'c'},
            {stageName: 'M-BROTH', fieldValuesStatus: 'c'},
            {stageName: 'VIDAS', fieldValuesStatus: 'c'},
            {stageName: 'CONTROLS', fieldValuesStatus: 'c'},
            {stageName: 'RESULTS', fieldValuesStatus: 'c'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'c'},
         ]);
   });

   it('should yield mixed statuses for mixed status test data', () => {
      const sig =  {employeeShortName: 'SCH', signedInstant: '2/2/2T02:02:02'};

      const partialTestData: TestData = {
         prepData: {
            sampleReceived: '3/12/2010',
            sampleReceivedFrom: 'Scott',
            descriptionMatchesCR: true,
            labelAttachmentType: 'NONE',
            containerMatchesCR: true,
            containerMatchesCRSignature: sig,
            codeMatchesCR: true,
            codeMatchesCRSignature: sig,
         },
         preEnrData: {
            samplingMethod: {
               name: 'x',
               description: 'x',
               extractedGramsPerSub: 1,
               numberOfComposites: 1,
               compositeMassGrams: 1,
               numberOfSubsPerComposite: 1,
               numberOfSubs: 1,
            },
            balanceId: 'x',
            // blenderJarId // required field omitted
            bagId: 'x',
            sampleSpike: true,
            spikePlateCount: 1,
            preenrichMediumBatchId: 'x',
            preenrichIncubatorId: 'x',
            preenrichPositiveControlGrowth: true,
            preenrichMediumControlGrowth: true,
            preenrichSignature: sig,
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            // rvttWaterBathId [required field omitted]
            rvttSignature: sig,
         },
         mBrothData: {
            mBrothBatchId: 'x',
            mBrothWaterBathId: 'x',
            // mBrothSignature [required field omitted]
         },
         vidasData: {
            // [all required fields omitted]
         },
         controlsData: {
            systemControlsPositiveControlGrowth: true,
            systemMediumPositiveControlGrowth: false,
            systemControlsSignature: sig,
            collectorControlsPositveControlGrowth: true,
            // collectorControlsMediumControlGrowth [required field omitted]
            collectorControlsSignature: sig,
            bacterialControlsUsed: false,
            bacterialControlsSignature: sig,
         },
         resultsData: {
            resultPositiveCompositesCount: 1,
            // resultSignature [required field omitted]
         },
         wrapupData: {
            reserveReserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            // reserveSampleDestinations [required field omitted]
            allCompletedSignature: sig,
         }
      };

      expect(getTestStageStatuses(partialTestData))
         .toEqual([
            {stageName: 'PREP', fieldValuesStatus: 'c'},
            {stageName: 'PRE-ENR', fieldValuesStatus: 'i'},
            {stageName: 'SEL-ENR', fieldValuesStatus: 'i'},
            {stageName: 'M-BROTH', fieldValuesStatus: 'i'},
            {stageName: 'VIDAS', fieldValuesStatus: 'e'},
            {stageName: 'CONTROLS', fieldValuesStatus: 'i'},
            {stageName: 'RESULTS', fieldValuesStatus: 'i'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'i'},
         ]);
   });

});
