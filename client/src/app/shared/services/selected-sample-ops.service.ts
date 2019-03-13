import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {SampleOp} from '../../../generated/dto';

@Injectable({
   providedIn: 'root'
})
export class SelectedSampleOpsService {

   private readonly sampleOps: BehaviorSubject<SampleOp[]>;

   constructor()
   {
      this.sampleOps = new BehaviorSubject<SampleOp[]>([]);
   }

   setSelectedSampleOps(sampleOps: SampleOp[])
   {
      this.sampleOps.next(sampleOps);
   }

   selectedSampleOps(): Observable<SampleOp[]>
   {
      return this.sampleOps;
   }

   selectedSampleOpsSnapshot(): SampleOp[]
   {
      return this.sampleOps.getValue();
   }

   takeSelectedSampleOps(): SampleOp[]
   {
      const selected = this.sampleOps.getValue();
      this.setSelectedSampleOps([]);
      return selected;
   }

}
