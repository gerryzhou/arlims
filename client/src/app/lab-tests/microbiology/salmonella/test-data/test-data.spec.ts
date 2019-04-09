import {emptyTestData, getTestStageStatuses, TestData} from './index';

describe('microbiology salmonella test data functions', () => {

   it('should yield empty for empty test data', () => {
      expect(getTestStageStatuses(emptyTestData(), null))
         .toEqual([
            {stageName: 'PREP', stageStatus: 'e'},
            {stageName: 'PRE-ENR', stageStatus: 'e'},
            {stageName: 'SEL-ENR', stageStatus: 'e'},
            {stageName: 'M-BROTH', stageStatus: 'e'},
            {stageName: 'VIDAS', stageStatus: 'e'},
            {stageName: 'POS-CONT', stageStatus: 'e'},
            {stageName: 'WRAPUP', stageStatus: 'e'},
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
               testUnitsType: 'composite',
               testUnitsCount: 1,
               numberOfSubsPerComposite: 1,
               extractedGramsPerSub: 1,
            },
            balanceId: 'x',
            blenderJarId: 'x',
            bagId: 'x',
            sampleSpike: true,
            mediumBatchId: 'x',
            mediumType: 'x',
            incubatorId: 'x',
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            bgBatchId: 'x',
            i2kiBatchId: 'x',
            spikePlateCount: 1,
            rvttWaterBathId: 'x',
            positiveControlGrowth: true,
            mediumControlGrowth: true,
            systemControlTypes: 'x',
            systemControlsGrowth: 'G',
            collectorControlTypes: 'x',
            collectorControlsGrowth: 'G',
            bacterialControlsUsed: false,
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
            methodRemarks: 'x'
         },
         posContData: null,
         wrapupData: {
            reserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            reserveSampleDestinations: 'x',
            testTimeCharges: {},
         }
      };

      expect(getTestStageStatuses(completeTestData, null))
         .toEqual([
            {stageName: 'PREP', stageStatus: 'c'},
            {stageName: 'PRE-ENR', stageStatus: 'c'},
            {stageName: 'SEL-ENR', stageStatus: 'c'},
            {stageName: 'M-BROTH', stageStatus: 'c'},
            {stageName: 'VIDAS', stageStatus: 'c'},
            {stageName: 'POS-CONT', stageStatus: 'c'},
            {stageName: 'WRAPUP', stageStatus: 'c'},
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
               testUnitsType: 'composite',
               testUnitsCount: 1,
               numberOfSubsPerComposite: 1,
               extractedGramsPerSub: 1,
            },
            balanceId: 'x',
            // blenderJarId // required field omitted
            bagId: 'x',
            sampleSpike: true,
            mediumBatchId: 'x',
            mediumType: 'x',
            incubatorId: 'x',
         },
         selEnrData: {
            rvBatchId: 'x',
            ttBatchId: 'x',
            spikePlateCount: 1,
            // rvttWaterBathId [required field omitted]
            positiveControlGrowth: true,
            mediumControlGrowth: true,
            systemControlTypes: 'x',
            systemControlsGrowth: 'G',
            collectorControlTypes: 'x',
            collectorControlsGrowth: 'G',
            bacterialControlsUsed: false,
         },
         mBrothData: {
            mBrothBatchId: 'x',
            // mBrothWaterBathId: [required field omitted]
         },
         vidasData: {
            // [all required fields omitted]
         },
         posContData: null,
         wrapupData: {
            reserveSampleDisposition: 'NO_RESERVE_SAMPLE',
            testTimeCharges: {}
         }
      };

      expect(getTestStageStatuses(partialTestData, null))
         .toEqual([
            {stageName: 'PREP', stageStatus: 'c'},
            {stageName: 'PRE-ENR', stageStatus: 'i'},
            {stageName: 'SEL-ENR', stageStatus: 'i'},
            {stageName: 'M-BROTH', stageStatus: 'i'},
            {stageName: 'VIDAS', stageStatus: 'e'},
            {stageName: 'WRAPUP', stageStatus: 'c'},
         ]);
   });

});
