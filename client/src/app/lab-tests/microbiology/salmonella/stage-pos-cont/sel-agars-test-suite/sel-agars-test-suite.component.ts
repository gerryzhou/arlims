import {Component, Input, OnChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {makeEmptyIsolateTestSequence, makeIsolateTestSequenceFormGroup, makeIsolateTestSequenceUid} from '../../test-data';
import {AppUser} from '../../../../../../generated/dto';
import {MatDialog} from '@angular/material';
import {SimpleInputDialogComponent} from '../../../../../common-components/simple-input-dialog/simple-input-dialog.component';

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

   constructor(private dialogSvc: MatDialog)
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

   onIsolateTestSequenceFailureDeclared(selAgar: string, isolateTestSeqUid: string)
   {
      const isolateNum = +this.form.get([selAgar, isolateTestSeqUid, 'isolateNumber']).value;
      this.addNewIsolateTestSequence(selAgar, isolateNum);
   }

   promptAddNewIsolateTestSequence(selAgar: string)
   {
      const isolateNumDlg = this.dialogSvc.open(SimpleInputDialogComponent,
         {
            data: {
               title: 'Create New Isolate',
               message: 'Enter an isolate number for the new isolate',
               acceptRegex: '^ *[1-9][0-9]* *$'
            },
            disableClose: false
         }
      );

      isolateNumDlg.afterClosed().subscribe(isolateNumStr => {
         const isolateNum = parseInt(isolateNumStr);
         if ( isolateNum )
         {
            this.addNewIsolateTestSequence(selAgar, isolateNum);
         }
      });
   }

   addNewIsolateTestSequence(selAgar: string, isolateNum: number)
   {
      const fg = this.form.get(selAgar) as FormGroup;

      const uid = makeIsolateTestSequenceUid(new Date(), this.appUser.username, 1, fg.controls);
      const emptyTestSeq = makeEmptyIsolateTestSequence(isolateNum);

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
