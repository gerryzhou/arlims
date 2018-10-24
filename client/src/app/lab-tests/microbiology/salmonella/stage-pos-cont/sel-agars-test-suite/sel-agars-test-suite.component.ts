import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {makeEmptyIsolateTestSequence, makeIsolateTestSequenceFormGroup, makeIsolateTestSequenceUid} from '../../test-data';

@Component({
   selector: 'app-sel-agars-test-suite',
   templateUrl: './sel-agars-test-suite.component.html',
   styleUrls: ['./sel-agars-test-suite.component.scss']
})
export class SelAgarsTestSuiteComponent implements OnChanges {

   @Input()
   form: FormGroup;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   selAgars: SelectiveAgar[] = [
      { formGroupName: 'he', displayName: 'HE'},
      { formGroupName: 'xld', displayName: 'XLD'},
      { formGroupName: 'bs24h', displayName: 'BS 24h'},
      { formGroupName: 'bs48h', displayName: 'BS 48h'},
   ];

   displayOrderedIsolateTestSeqUidsBySelAgar: IsolateTestSeqUidsBySelAgar;

   constructor()
   {
      this.displayOrderedIsolateTestSeqUidsBySelAgar = {};
      for ( const selAgarName of Object.keys(this.selAgars) )
         this.displayOrderedIsolateTestSeqUidsBySelAgar[selAgarName] = [];
   }

   ngOnChanges()
   {
      this.refreshDisplayOrderedIsolateTestSeqUids();
   }

   removeIsolateTestSequence(selAgar: string, testSeqUid: string)
   {
      const fg = this.form.get(selAgar) as FormGroup;
      fg.removeControl(testSeqUid);

      this.refreshDisplayOrderedIsolateTestSeqUids(selAgar);
   }

   onIsolateTestSequenceFailureDeclared(selAgar: string)
   {
      this.addNewIsolateTestSequence(selAgar);
   }

   addNewIsolateTestSequence(selAgar: string)
   {
      const fg = this.form.get(selAgar) as FormGroup;

      const sortedSeqNums = Object.values(fg.controls).map(ctl => parseInt(ctl.get('creationSeqNum').value)).sort();
      const newSeqNum = sortedSeqNums.length > 0 ? sortedSeqNums[sortedSeqNums.length - 1] + 1 : 1;

      const emptyTestSeq = makeEmptyIsolateTestSequence(newSeqNum);

      let uid = makeIsolateTestSequenceUid();
      while ( fg.controls[uid] != null )
         uid = makeIsolateTestSequenceUid();

      fg.addControl(uid, makeIsolateTestSequenceFormGroup(emptyTestSeq));

      this.refreshDisplayOrderedIsolateTestSeqUids(selAgar);
   }

   private refreshDisplayOrderedIsolateTestSeqUids(selAgarName: string | null = null)
   {
      if ( selAgarName != null )
         this.displayOrderedIsolateTestSeqUidsBySelAgar[selAgarName] =
            this.getDisplayOrderedIsolateTestSeqUids(selAgarName);
      else
      {
         for ( const selAgar of this.selAgars )
         {
            this.displayOrderedIsolateTestSeqUidsBySelAgar[selAgar.formGroupName] =
               this.getDisplayOrderedIsolateTestSeqUids(selAgar.formGroupName);
         }
      }
   }

   private getDisplayOrderedIsolateTestSeqUids(selAgar: string): string[]
   {
      const fg = this.form.get(selAgar) as FormGroup;

      return (
         Object.entries(fg.controls)
            .map(([uid, ctl]) => <[string, string, number]>[
               uid,
               ctl.get('createdAtEpochMillis').value as string,
               parseInt(ctl.get('creationSeqNum').value)
            ])
            .sort(([uid1, ts1, seqn1], [uid2, ts2, seqn2]) => {
               if (ts1 < ts2) return -1;
               else if (ts1 > ts2) return 1;
               else return seqn1 - seqn2;
            })
            .map(t => t[0])
      );
   }
}

interface SelectiveAgar {
   formGroupName: string;
   displayName: string;
}

interface IsolateTestSeqUidsBySelAgar { [selAgarFormGroupName: string]: string[]; }
