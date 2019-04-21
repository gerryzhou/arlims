import {Injectable} from '@angular/core';

import {SampleOp} from '../../../generated/dto';

@Injectable({
   providedIn: 'root'
})
export class SelectedSampleOpsService {

   private sampleOps: SampleOp[];

   constructor()
   {
      this.sampleOps = [];
   }

   setSampleOps(sampleOps: SampleOp[])
   {
      this.sampleOps = sampleOps;
   }

   takeSampleOps(): SampleOp[]
   {
      const res = this.sampleOps;
      this.sampleOps = [];
      return res;
   }
}
