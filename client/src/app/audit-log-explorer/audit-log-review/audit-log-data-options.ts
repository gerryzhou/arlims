import {Moment} from 'moment';

export interface AuditLogDataOptions
{
   fromMoment: Moment | null;
   toMoment: Moment | null;
   testId: number | null;
   username: string | null;
   includeChangeDetailData: boolean;
   includeUnchangedSaves: boolean;
}
