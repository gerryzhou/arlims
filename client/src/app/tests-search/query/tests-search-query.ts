import {Moment} from 'moment';

import {TestTimestampProperty} from '../../shared/client-models/test-timestamp-properties';
import {LabTestTypeCode} from '../../../generated/dto';

export interface TestsSearchQuery {

   searchText: string | null;

   fromTimestamp: Moment | null;

   toTimestamp: Moment | null;

   timestampPropertyName: TestTimestampProperty;

   testTypeCode: LabTestTypeCode | null;

   testTypeSearchScopeName: string | null;
}

export function emptyTestsSearchQuery(): TestsSearchQuery
{
   return {
      searchText: null,
      fromTimestamp: null,
      toTimestamp: null,
      timestampPropertyName: 'created',
      testTypeCode: null,
      testTypeSearchScopeName: null,
   };
}
