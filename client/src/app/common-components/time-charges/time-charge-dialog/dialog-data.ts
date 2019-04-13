import {UserReference} from '../../../../generated/dto';
import {AppUserTimeCharge} from '../app-user-time-charge';

export interface DialogData {

   userTimeCharge: AppUserTimeCharge | null;

   availableUsers: UserReference[] | null;

   userFieldEditable: boolean;
}
