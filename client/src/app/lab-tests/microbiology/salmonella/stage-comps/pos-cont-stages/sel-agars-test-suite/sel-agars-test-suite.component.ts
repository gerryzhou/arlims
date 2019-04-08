import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   Input,
   OnChanges,
   OnDestroy,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';

import {makeEmptyIsolateTestSequence, makeIsolateTestSequenceFormGroup, makeIsolateTestSequenceUid} from '../../../test-data';
import {AppUser} from '../../../../../../../generated/dto';
import {SimpleInputDialogComponent} from '../../../../../../common-components/simple-input-dialog/simple-input-dialog.component';

@Component({
   selector: 'app-sel-agars-test-suite',
   templateUrl: './sel-agars-test-suite.component.html',
   styleUrls: ['./sel-agars-test-suite.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelAgarsTestSuiteComponent implements OnChanges, OnDestroy {

   @Input()
   stage: 'SLANT' | 'IDENT';

   @Input()
   showOtherStageDataAsContext;

   @Input()
   allowDataChanges: boolean;

   @Input()
   form: FormGroup;

   @Input()
   testUnitDescription: string;

   @Input()
   medium: string;

   @Input()
   appUser: AppUser;

   @Input()
   includeOxidase = true;

   @Input()
   showAddIsolatesButton = true;

   @Input()
   showIsolateNumber = true;

   @Input()
   showUnsetAffordances = false;

   containsDisplayableIsolate: boolean;

   readonly SEL_AGARS: SelectiveAgar[] = [
      { formGroupName: 'he', displayName: 'HE'},
      { formGroupName: 'xld', displayName: 'XLD'},
      { formGroupName: 'bs24h', displayName: 'BS 24h'},
      { formGroupName: 'bs48h', displayName: 'BS 48h'},
   ];

   displayOrderedIsolateTestSeqUidsBySelAgar: IsolateTestSeqUidsBySelAgar;

   readonly formBuilder = new FormBuilder();

   formChangesSubscription: Subscription;

   constructor(private changeDetectorRef: ChangeDetectorRef, private dialogSvc: MatDialog)
   {
      this.displayOrderedIsolateTestSeqUidsBySelAgar = {};
      for ( const selAgarName of Object.keys(this.SEL_AGARS) )
         this.displayOrderedIsolateTestSeqUidsBySelAgar[selAgarName] = [];
      this.containsDisplayableIsolate = false;
   }

   ngOnChanges()
   {
      this.refreshDisplayOrderedIsolateTestSeqUids();

      if ( this.formChangesSubscription )
         this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = this.form.valueChanges.subscribe(() => {
         this.refreshDisplayOrderedIsolateTestSeqUids();
         this.changeDetectorRef.markForCheck();
      });

      if ( this.allowDataChanges && this.form.disabled )
         this.form.enable();
      else if ( !this.allowDataChanges && !this.form.disabled )
         this.form.disable();
   }

   removeIsolateTestSequence(selAgar: string, testSeqUid: string)
   {
      const fg = this.form.get(selAgar) as FormGroup;
      fg.removeControl(testSeqUid);
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
            this.addNewIsolateTestSequence(selAgar, isolateNum);
      });
   }

   addNewIsolateTestSequence(selAgar: string, isolateNum: number)
   {
      const fg = this.form.get(selAgar) as FormGroup;

      const uid = makeIsolateTestSequenceUid(isolateNum, fg.controls);
      const emptyTestSeq = makeEmptyIsolateTestSequence(isolateNum);

      fg.addControl(uid, makeIsolateTestSequenceFormGroup(this.formBuilder, emptyTestSeq));
   }

   private refreshDisplayOrderedIsolateTestSeqUids()
   {
      let displayableIsolateFound = false;
      this.displayOrderedIsolateTestSeqUidsBySelAgar = {};
      for ( const selAgar of this.SEL_AGARS )
      {
         const fgName = selAgar.formGroupName;
         const displayIsolateUids = this.getDisplayOrderedIsolateTestSeqUids(fgName);
         this.displayOrderedIsolateTestSeqUidsBySelAgar[fgName] = displayIsolateUids;
         if ( displayIsolateUids.length > 0 )
            displayableIsolateFound = true;
      }

      this.containsDisplayableIsolate = displayableIsolateFound;
   }

   private getDisplayOrderedIsolateTestSeqUids(selAgar: string): string[]
   {
      const selAgarFg = this.form.get(selAgar) as FormGroup;

      const isolateUids = this.stage === 'SLANT' ? Object.keys(selAgarFg.controls)
         : Object.keys(selAgarFg.controls).filter(uid => selAgarFg.get([uid, 'identification']) != null);

      return isolateUids.sort((uid1, uid2) => {
         const isolateNum1 = parseInt(uid1);
         const isolateNum2 = parseInt(uid2);
         const isolateNumDiff = isolateNum1 - isolateNum2;
         if ( isolateNumDiff !== 0 )
            return isolateNumDiff;

         const dashIx1 = uid1.indexOf('-');
         if ( dashIx1 === -1 )
            return -1;
         const dashIx2 = uid2.indexOf('-');
         if ( dashIx2 === -1 )
            return 1;

         const trailingNum1 = parseInt(uid1.substr(dashIx1 + 1));
         const trailingNum2 = parseInt(uid2.substr(dashIx2 + 1));
         return trailingNum1 - trailingNum2;
      });
   }

   ngOnDestroy()
   {
      if ( this.formChangesSubscription )
         this.formChangesSubscription.unsubscribe();
   }
}

interface SelectiveAgar {
   formGroupName: string;
   displayName: string;
}

interface IsolateTestSeqUidsBySelAgar { [selAgarFormGroupName: string]: string[]; }
