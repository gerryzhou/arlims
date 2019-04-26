import {IsolateTestSequence} from '../../../test-data';

export interface IsolateSlantStageEditDialogInputData {

   editableIsolateNumber: boolean;

   isolateTestSequence: IsolateTestSequence | null;

   includeOxidase: boolean;

   testUnitDescription: string;

   medium: string;

   selectiveAgarDisplayName: string;

   showUnsetAffordances: boolean;

}
