import {LabTestMetadata} from '../../../generated/dto';

export class LabTestStageMetadata {
   constructor(public labTestMetadata: LabTestMetadata, public stageName: string) {}
}


