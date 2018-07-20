import {stageNameToTestDataFieldName, stageTestDataFieldNameToStageName} from './test-stages';

describe('stage utility functions', () => {

   it('should yield proper field name for a given hyphenated stage name', () => {
      expect(stageNameToTestDataFieldName('MY-STAGE')).toBe('myStageData');
   });

   it('should yield proper field name for a given non-hyphenated stage name', () => {
      expect(stageNameToTestDataFieldName('SOMETHING')).toBe('somethingData');
   });

   it('should yield proper stage name for a given multipart camelcase field name', () => {
      expect(stageTestDataFieldNameToStageName('myStageData')).toBe('MY-STAGE');
   });

   it('should yield proper stage name for a given single part camelcase field name', () => {
      expect(stageTestDataFieldNameToStageName('somethingData')).toBe('SOMETHING');
   });

});


