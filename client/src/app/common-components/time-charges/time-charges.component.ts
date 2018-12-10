import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {UserReference} from '../../../generated/dto';
import {UserTimeCharge} from './user-time-charge';
import {makeTimeChargeFormGroup} from '../../shared/models/time-charges';
import {UserTimeChargeDialogComponent} from './time-charge-dialog/user-time-charge-dialog.component';

@Component({
   selector: 'app-time-charges',
   templateUrl: './time-charges.component.html',
   styleUrls: ['./time-charges.component.scss']
})
export class TimeChargesComponent implements OnChanges, OnDestroy {

   @Input()
   form: FormGroup; // from makeTestTimeChargesFormGroup() in form-groups.ts

   @Input()
   availableUsers: UserReference[];

   @Input()
   viewOnly = false;

   formChangesSubscription: Subscription;

   readonly tableDataSource: MatTableDataSource<UserTimeCharge>;
   readonly tableDisplayColumns = ['edit', 'user', 'role', 'status', 'hours', 'delete'];

   constructor
      (
         private changeDetectorRef: ChangeDetectorRef,
         private dialogSvc: MatDialog
      )
   {
      this.tableDataSource = new MatTableDataSource<UserTimeCharge>([]);
   }

   ngOnChanges()
   {
      this.refreshTableDataSource();

      if ( this.formChangesSubscription )
         this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = this.form.valueChanges.subscribe(() => {
         this.refreshTableDataSource();
         this.changeDetectorRef.markForCheck();
      });
   }

   refreshTableDataSource()
   {
      const userShortNames = Object.keys(this.form.controls);

      const userTimeCharges =
         userShortNames.map(userShortName => {
            const timeCharge = this.form.get(userShortName).value;
            const role = timeCharge.role;
            const assignmentStatus = timeCharge.assignmentStatus;
            const hours = +timeCharge.hours;
            const enteredTimestamp = timeCharge.enteredTimestamp;
            return { userShortName, timeCharge: { role, assignmentStatus, hours, enteredTimestamp } };
         });

      this.tableDataSource.data =
          userTimeCharges.sort((userTimeCharge1, userTimeCharge2) => {
             const ts1 = userTimeCharge1.timeCharge.enteredTimestamp;
             const ts2 = userTimeCharge2.timeCharge.enteredTimestamp;
             return ts1 < ts2 ? -1 : ts1 > ts2 ? 1 : 0;
          });
   }

   promptCreateUserTimeCharge()
   {
      const chargedUserShortNames =
         new Set(this.tableDataSource.data.map(u => u.userShortName));
      const selectableUsers = this.availableUsers.filter(user =>
         !chargedUserShortNames.has(user.shortName)
      );

      const dlg = this.dialogSvc.open(UserTimeChargeDialogComponent, {
         width: 'calc(75%)',
         data: {
            userTimeCharge: null,
            availableUsers: selectableUsers,
         }
      });

      dlg.afterClosed().subscribe((userTimeCharge: UserTimeCharge) => {
         if ( userTimeCharge )
         {
            this.form.addControl(
               userTimeCharge.userShortName,
               makeTimeChargeFormGroup(userTimeCharge.timeCharge)
            );
         }
      });
   }

   promptUpdateUserTimeCharge(userTimeCharge: UserTimeCharge)
   {
      const dlg = this.dialogSvc.open(UserTimeChargeDialogComponent, {
         width: 'calc(75%)',
         data: {
            userTimeCharge,
            availableUsers: this.availableUsers,
         }
      });

      dlg.afterClosed().subscribe((updatedUserTimeCharge: UserTimeCharge) => {
         if ( updatedUserTimeCharge )
         {
            const updatedTimeCharge = updatedUserTimeCharge.timeCharge;
            this.form.get(userTimeCharge.userShortName).setValue(updatedTimeCharge);
         }
      });
   }

   removeUserTimeCharge(userTimeCharge: UserTimeCharge)
   {
      this.form.removeControl(userTimeCharge.userShortName);
      this.refreshTableDataSource();
   }

   ngOnDestroy()
   {
      if ( this.formChangesSubscription )
         this.formChangesSubscription.unsubscribe();
   }
}
