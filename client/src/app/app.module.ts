import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {DatePipe, Location} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {CommonComponentsModule} from './common-components/common-components.module';
import {MaterialUiModule} from './material-ui.module';
import {UserContextService, LoadingStatusService, LoadingStatusInterceptor, ApiUrlsService} from './shared/services';
import {SamplesListingComponent} from './samples-listing/samples-listing.component';
import {SamplesListingOptionsComponent} from './samples-listing/listing-options/samples-listing-options.component';
import {TestsSearchComponent} from './tests-search/tests-search.component';
import {TestsSearchQueryComponent} from './tests-search/query/tests-search-query.component';
import {LoginComponent} from './login/login.component';
import {AlertMessageComponent} from './alerts/alert-message.component';
import {RegistrationComponent} from './registration/registration.component';
import {AuthTokenHttpInterceptor} from './shared/services/auth-token-http-interceptor';

@NgModule({
   declarations: [
      AppComponent,
      AlertMessageComponent,
      SamplesListingComponent,
      SamplesListingOptionsComponent,
      TestsSearchComponent,
      LoginComponent,
      RegistrationComponent,
      TestsSearchQueryComponent,
   ],
   entryComponents: [
     // (dialog components here)
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      BrowserAnimationsModule,
      TruncateModule,
      // app modules which are NOT LOADED LAZILY
      CommonComponentsModule,
      MaterialUiModule,
      AppRoutingModule,
   ],
   providers: [
      Location,
      DatePipe, // for use in JS
      LoadingStatusService,
      {
         provide: HTTP_INTERCEPTORS,
         useFactory: svc => new LoadingStatusInterceptor(svc),
         multi: true,
         deps: [LoadingStatusService]
      },
      AuthTokenHttpInterceptor,
      {
         provide: HTTP_INTERCEPTORS,
         useClass:  AuthTokenHttpInterceptor,
         multi: true,
         deps: [UserContextService, ApiUrlsService]
      },
      UserContextService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
