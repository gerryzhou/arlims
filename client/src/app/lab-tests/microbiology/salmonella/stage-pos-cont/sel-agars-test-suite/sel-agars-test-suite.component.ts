import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {makeEmptyIsolateTestSequence, makeIsolateTestSequenceFormGroup, makeIsolateTestSequenceUid} from '../../test-data';
import {AppUser} from '../../../../../../generated/dto';

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

   @Input()
   appUser: AppUser;

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

      const uid = makeIsolateTestSequenceUid(new Date(), this.appUser.username, 1, fg.controls);
      const emptyTestSeq = makeEmptyIsolateTestSequence();

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
      return Object.keys(fg.controls).sort();
   }
}

interface SelectiveAgar {
   formGroupName: string;
   displayName: string;
}

interface IsolateTestSeqUidsBySelAgar { [selAgarFormGroupName: string]: string[]; }
