import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertMessageService} from '../shared/services/alerts';
import {AppInternalUrlsService} from '../shared/services/app-internal-urls.service';
import {UserContextService} from '../shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

   form: FormGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
   });

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
         this.alertMsgSvc.alertWarning('Username or password field was not supplied or is invalid.');
      else
      {
         const {username, password } = this.form.value;

         this.usrCtxSvc.login(username, password).subscribe(
            loginSucceeded => {
               if ( loginSucceeded === true )
                  this.router.navigate(this.appUrlsSvc.home());
               else
                  this.alertMsgSvc.alertWarning('Invalid username or password.');
            },
            err => {
               this.alertMsgSvc.alertDanger('Login failed' + (err.message ? ': ' + err.message + '.' : '.'));
            }
         );
      }
   }
}
