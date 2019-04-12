import {OptimisticDataUpdateResult} from '../../../generated/dto';

export interface TestDataSaveResult {
   savedTestData: any | null;
   optimisticDataUpdateResult: OptimisticDataUpdateResult;
}
