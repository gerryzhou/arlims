import {Sample} from '../../../generated/dto';

export interface SamplesResourcesAssociation {
   listName: string;
   appendDateTimeToListName: boolean;
   samples: Sample[];
   resourceCodes: string[];
}
