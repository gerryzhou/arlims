import {UserReference} from '../../../../generated/dto';
import {UserTimeCharge} from '../user-time-charge';

export interface DialogData {

   userTimeCharge: UserTimeCharge | null;

   availableUsers: UserReference[] | null;

}
