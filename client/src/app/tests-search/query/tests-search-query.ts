import {Moment} from 'moment';

import {SampleOpStatusCode} from '../../shared/models/sample-op-status';
import {TestTimestampProperty} from '../../shared/models/test-timestamp-properties';
import {LabTestTypeCode} from '../../../generated/dto';

export interface TestsSearchQuery {

   searchText: string | null;

   fromTimestamp: Moment | null;

   toTimestamp: Moment | null;

   timestampPropertyName: TestTimestampProperty;

   includeStatusCodes: SampleOpStatusCode[] | null;

   testTypeCode: LabTestTypeCode | null;
}
