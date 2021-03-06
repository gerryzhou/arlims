import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

import {TimeChargeStatusCode, UserReference} from '../../../generated/dto';
import {AppUserTimeCharge} from './app-user-time-charge';
import {UserTimeChargeDialogComponent} from './time-charge-dialog/user-time-charge-dialog.component';
import {makeTimeChargeFormGroup, TimeChargeRole} from '../../lab-tests/microbiology/salmonella/test-data';

@Component({
   selector: 'app-time-charges',
   templateUrl: './time-charges.component.html',
   styleUrls: ['./time-charges.component.scss']
})
export class TimeChargesComponent implements OnChanges, OnDestroy {

   @Input()
   form: FormGroup; // contains time charge form groups by user short name, from makeTimeChargesSetFormGroup() in form-groups.ts

   @Input()
   availableUsers: UserReference[];

   @Input()
   allowDataChanges: boolean;

   @Input()
   allowDeletes: boolean;

   @Input()
   defaultFirstUserShortName: string | null;

   @Input()
   defaultFirstUserRole: TimeChargeRole | null;

   @Input()
   defaultFirstUserStatusCode: TimeChargeStatusCode | null;

   @Output()
   timeChargeCreate = new EventEmitter<AppUserTimeCharge>();

   @Output()
   timeChargeUpdate = new EventEmitter<AppUserTimeCharge>();

   @Output()
   timeChargeDelete = new EventEmitter<AppUserTimeCharge>();

   @Output()
   timeChargesDataChange = new EventEmitter<void>();

   formChangesSubscription: Subscription;

   readonly tableDataSource: MatTableDataSource<AppUserTimeCharge>;
   readonly tableDisplayColumns = ['edit', 'user', 'role', 'status', 'hours', 'delete'];

   constructor
      (
         private changeDetectorRef: ChangeDetectorRef,
         private dialogSvc: MatDialog
      )
   {
      this.tableDataSource = new MatTableDataSource<AppUserTimeCharge>([]);
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
      const userTimeCharges = this.getUserTimeCharges();

      this.tableDataSource.data =
          userTimeCharges.sort((userTimeCharge1, userTimeCharge2) => {
             const ts1 = userTimeCharge1.timeCharge.enteredTimestamp;
             const ts2 = userTimeCharge2.timeCharge.enteredTimestamp;
             return ts1 < ts2 ? -1 : ts1 > ts2 ? 1 : 0;
          });
   }

   getUserTimeCharges(): AppUserTimeCharge[]
   {
      const userShortNames = Object.keys(this.form.controls);

      return (
         userShortNames.map(userShortName => {
            const timeCharge = this.form.get(userShortName).value;
            const role = timeCharge.role;
            const assignmentStatus = timeCharge.assignmentStatus;
            const hours = +timeCharge.hours;
            const enteredTimestamp = timeCharge.enteredTimestamp;
            return { userShortName, timeCharge: { role, assignmentStatus, hours, enteredTimestamp } };
         })
      );
   }

   promptCreateUserTimeCharge()
   {
      const chargedUserShortNames =
         new Set(this.tableDataSource.data.map(u => u.userShortName));

      const selectableUsers = this.availableUsers.filter(user =>
         !chargedUserShortNames.has(user.shortName)
      );

      const isFirstUser = this.tableDataSource.data.length === 0;
      const defaultUserShortName = isFirstUser ? this.defaultFirstUserShortName : null;
      const defaultRole = isFirstUser ? this.defaultFirstUserRole : null;
      const defaultStatus = isFirstUser ? this.defaultFirstUserStatusCode : null;

      const dlg = this.dialogSvc.open(UserTimeChargeDialogComponent, {
         width: 'calc(75%)',
         data: {
            userTimeCharge: {
               userShortName: defaultUserShortName,
               timeCharge: {
                  role: defaultRole,
                  hours: null,
                  assignmentStatus: defaultStatus,
                  enteredTimestamp: null,
               }
            },
            availableUsers: selectableUsers,
            userFieldEditable: true
         }
      });

      dlg.afterClosed().subscribe((userTimeCharge: AppUserTimeCharge) => {
         if ( userTimeCharge )
         {
            this.form.addControl(
               userTimeCharge.userShortName,
               makeTimeChargeFormGroup(new FormBuilder(), userTimeCharge.timeCharge)
            );

            this.timeChargeCreate.emit(userTimeCharge);
            this.timeChargesDataChange.emit();
         }
      });
   }

   promptUpdateUserTimeCharge(userTimeCharge: AppUserTimeCharge)
   {
      const dlg = this.dialogSvc.open(UserTimeChargeDialogComponent, {
         width: 'calc(75%)',
         data: {
            userTimeCharge,
            availableUsers: this.availableUsers,
            userFieldEditable: false
         }
      });

      dlg.afterClosed().subscribe((updatedUserTimeCharge: AppUserTimeCharge) => {
         if ( updatedUserTimeCharge )
         {
            const updatedTimeCharge = updatedUserTimeCharge.timeCharge;
            this.form.get(userTimeCharge.userShortName).setValue(updatedTimeCharge);

            this.timeChargeUpdate.emit(userTimeCharge);
            this.timeChargesDataChange.emit();
         }
      });
   }

   removeUserTimeCharge(userTimeCharge: AppUserTimeCharge)
   {
      this.form.removeControl(userTimeCharge.userShortName);
      this.refreshTableDataSource();

      this.timeChargeDelete.emit(userTimeCharge);
      this.timeChargesDataChange.emit();
   }

   ngOnDestroy()
   {
      if ( this.formChangesSubscription )
         this.formChangesSubscription.unsubscribe();
   }
}
