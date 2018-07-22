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
      const completeTestData: TestData = {
         prepData: {
            sampleReceived: '3/12/2010',
            sampleReceivedFrom: 'Scott',
            descriptionMatchesCR: true,
            labelAttachmentType: 'NONE',
            containerMatchesCR: true,
            codeMatchesCR: true,
         },
         preEnrData: {
            samplingMethod: {
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
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            bgBatchId: 'x',
            l2KiBatchId: 'x',
            rvttWaterBathId: 'x',
         },
         mBrothData: {
            mBrothBatchId: 'x',
            mBrothWaterBathId: 'x',
         },
         vidasData: {
            instrumentId: 'x',
            kitIds: 'x',
            compositesDetection: true,
            positiveControlDetection: true,
            mediumControlDetection: false,
            spikeDetection: false,
         },
         controlsData: {
            systemControlsPositiveControlGrowth: true,
            systemMediumPositiveControlGrowth: false,
            collectorControlsPositveControlGrowth: true,
            collectorControlsMediumControlGrowth: false,
            bacterialControlsUsed: false,
         },
         resultsData: {
            resultPositiveCompositesCount: 1,
         },
         wrapupData: {
            reserveReserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            reserveSampleDestinations: 'x',
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
      const partialTestData: TestData = {
         prepData: {
            sampleReceived: '3/12/2010',
            sampleReceivedFrom: 'Scott',
            descriptionMatchesCR: true,
            labelAttachmentType: 'NONE',
            containerMatchesCR: true,
            codeMatchesCR: true,
         },
         preEnrData: {
            samplingMethod: {
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
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            // rvttWaterBathId [required field omitted]
         },
         mBrothData: {
            mBrothBatchId: 'x',
            // mBrothWaterBathId: [required field omitted]
         },
         vidasData: {
            // [all required fields omitted]
         },
         controlsData: {
            systemControlsPositiveControlGrowth: true,
            systemMediumPositiveControlGrowth: false,
            collectorControlsPositveControlGrowth: true,
            // collectorControlsMediumControlGrowth [required field omitted]
            bacterialControlsUsed: false,
         },
         resultsData: {
            // resultPositiveCompositesCount [required field omitted]
         },
         wrapupData: {
            reserveReserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            // reserveSampleDestinations [required field omitted]
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
            {stageName: 'RESULTS', fieldValuesStatus: 'e'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'i'},
         ]);
   });

});
