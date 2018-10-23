import {emptyTestData, getTestStageStatuses, TestData} from './test-data';

describe('microbiology salmonella test data functions', () => {

   it('should yield empty for empty test data', () => {
      expect(getTestStageStatuses(emptyTestData(), null))
         .toEqual([
            {stageName: 'PREP', fieldValuesStatus: 'e'},
            {stageName: 'PRE-ENR', fieldValuesStatus: 'e'},
            {stageName: 'SEL-ENR', fieldValuesStatus: 'e'},
            {stageName: 'M-BROTH', fieldValuesStatus: 'e'},
            {stageName: 'VIDAS', fieldValuesStatus: 'e'},
            {stageName: 'CONTROLS', fieldValuesStatus: 'e'},
            {stageName: 'POS-CONT', fieldValuesStatus: 'e'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'e'},
         ]);
   });

   it('should yield all complete for complete test data', () => {
      const completeTestData: TestData = {
         prepData: {
            sampleReceivedDate: '3/12/2010',
            sampleReceivedFrom: 'Scott',
            descriptionMatchesCR: true,
            // descriptionMatchesCRNotes (not required)
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
            mediumBatchId: 'x',
            mediumType: 'x',
            incubatorId: 'x',
            positiveControlGrowth: true,
            mediumControlGrowth: true,
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            bgBatchId: 'x',
            i2kiBatchId: 'x',
            spikePlateCount: 1,
            rvttWaterBathId: 'x',
         },
         mBrothData: {
            mBrothBatchId: 'x',
            mBrothWaterBathId: 'x',
            waterBathStarted: 'x',
         },
         vidasData: {
            instrumentId: 'x',
            kitIds: 'x',
            testUnitDetections: [true],
            positiveControlDetection: true,
            mediumControlDetection: false,
            spikeDetection: false,
         },
         controlsData: {
            systemControlsUsed: true,
            systemControlTypes: 'x',
            systemControlsGrowth: true,
            collectorControlsUsed: true,
            collectorControlTypes: 'x',
            collectorControlsGrowth: true,
            bacterialControlsUsed: false,
         },
         posContData: null, // TODO
         wrapupData: {
            reserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            reserveSampleDestinations: 'x',
         }
      };

      expect(getTestStageStatuses(completeTestData, null))
         .toEqual([
            {stageName: 'PREP', fieldValuesStatus: 'c'},
            {stageName: 'PRE-ENR', fieldValuesStatus: 'c'},
            {stageName: 'SEL-ENR', fieldValuesStatus: 'c'},
            {stageName: 'M-BROTH', fieldValuesStatus: 'c'},
            {stageName: 'VIDAS', fieldValuesStatus: 'c'},
            {stageName: 'CONTROLS', fieldValuesStatus: 'c'},
            {stageName: 'POS-CONT', fieldValuesStatus: 'c'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'c'},
         ]);
   });

   it('should yield mixed statuses for mixed status test data', () => {
      const partialTestData: TestData = {
         prepData: {
            sampleReceivedDate: '3/12/2010',
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
            mediumBatchId: 'x',
            mediumType: 'x',
            incubatorId: 'x',
            positiveControlGrowth: true,
            mediumControlGrowth: true,
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            spikePlateCount: 1,
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
            systemControlsUsed: true,
            systemControlTypes: 'x',
            systemControlsGrowth: true,
            collectorControlsUsed: true,
            collectorControlTypes: 'x',
            // collectorControlsGrowth: true, [required field omitted]
            bacterialControlsUsed: false,
         },
         wrapupData: {
            reserveSampleDisposition: 'NO_RESERVE_SAMPLE',
         }
      };

      expect(getTestStageStatuses(partialTestData, null))
         .toEqual([
            {stageName: 'PREP', fieldValuesStatus: 'c'},
            {stageName: 'PRE-ENR', fieldValuesStatus: 'i'},
            {stageName: 'SEL-ENR', fieldValuesStatus: 'i'},
            {stageName: 'M-BROTH', fieldValuesStatus: 'i'},
            {stageName: 'VIDAS', fieldValuesStatus: 'e'},
            {stageName: 'CONTROLS', fieldValuesStatus: 'i'},
            {stageName: 'WRAPUP', fieldValuesStatus: 'c'},
         ]);
   });

});
