import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertMessageService} from '../shared/services/alerts';
import {AppInternalUrlsService} from '../shared/services/app-internal-urls.service';
import {UserContextService} from '../shared/services';
import {UserRegistration} from '../../generated/dto';

@Component({
   selector: 'app-registration',
   templateUrl: './registration.component.html',
   styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

   form: FormGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordAgain: new FormControl('', [Validators.required, Validators.minLength(8)]),
      shortName: new FormControl('', [Validators.required]),
      // lab group id is fixed
      factsPersonId: new FormControl('', [Validators.min(0)]),
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', []),
      // role names are determined from admin checkbox for now
      isAdmin: new FormControl(false),
   });

   @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

   constructor
   (
      private appUrlsSvc: AppInternalUrlsService,
      private alertMsgSvc: AlertMessageService,
      private router: Router,
      private usrCtxSvc: UserContextService
   )
   {}

   onFormSubmit()
   {
      if ( !this.form.valid )
         this.alertMsgSvc.alertWarning('One or more values are not valid, please make corrections and try again.');
      else
      {
         const formVal = this.form.value;

         if ( formVal.password !== formVal.passwordAgain )
         {
            this.alertMsgSvc.alertWarning('The entered passwords do not match, please try again.');
            return;
         }

         const userRegistration: UserRegistration = {
            id: NaN,
            username: formVal.username.toLowerCase(),
            password: formVal.password,
            shortName: formVal.shortName,
            labGroupId: this.usrCtxSvc.getAuthenticatedUser().getValue().labGroupId,
            factsPersonId: formVal.factsPersonId,
            lastName: formVal.lastName,
            firstName: formVal.firstName,
            middleName: formVal.middleName,
            roleNames: formVal.isAdmin ? ['USER', 'ADMIN'] : ['USER']
         };

         this.usrCtxSvc.registerNewUser(userRegistration).subscribe(
            () => {
               this.formGroupDirective.resetForm();
               this.alertMsgSvc.alertInfo(`New user ${userRegistration.username} created.`);
            },
            err => {
               this.alertMsgSvc.alertDanger('Unexpected error ' + (err.message ? ': ' + err.message + '.' : '.'));
            }
         );
      }
   }

}

