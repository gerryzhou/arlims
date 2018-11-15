import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {DatePipe, Location} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
   MatInputModule,
   MatCheckboxModule,
   MatSelectModule,
   MatMenuModule,
   MatPaginatorModule,
   MatProgressSpinnerModule,
   MatSortModule,
   MatTableModule,
   MatToolbarModule,
   MatTooltipModule,
   MatCardModule,
   MatChipsModule,
   MatExpansionModule,
   MatSnackBarModule,
   MatSlideToggleModule,
   MatDialogModule
} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {UserContextService, LoadingStatusService, LoadingStatusInterceptor, ApiUrlsService} from './shared/services';
import {SamplesListingComponent} from './samples-listing/samples-listing.component';
import {AlertMessageComponent} from './alerts/alert-message.component';
import {SamplesListingOptionsComponent} from './samples-listing/listing-options/samples-listing-options.component';
import {CommonComponentsModule} from './common-components/common-components.module';
import {LoginComponent} from './login/login.component';
import {AuthTokenHttpInterceptor} from './shared/services/auth-token-http-interceptor';
import {RegistrationComponent} from './registration/registration.component';

@NgModule({
   declarations: [
      AppComponent,
      AlertMessageComponent,
      SamplesListingComponent,
      SamplesListingOptionsComponent,
      LoginComponent,
      RegistrationComponent,
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
      MatToolbarModule,
      MatTooltipModule,
      MatCardModule,
      MatMenuModule,
      MatInputModule,
      MatCheckboxModule,
      MatSelectModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatProgressSpinnerModule,
      MatIconModule,
      MatButtonModule,
      MatChipsModule,
      MatExpansionModule,
      MatSnackBarModule,
      MatSlideToggleModule,
      MatDialogModule,
      MatMomentDateModule,
      TruncateModule,
      // app modules which are NOT LOADED LAZILY
      CommonComponentsModule,
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
