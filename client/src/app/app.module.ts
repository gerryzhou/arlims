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
   MatDialogModule,
   MatDatepickerModule
} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {AlertMessageComponent} from './alerts/alert-message.component';
import {CommonComponentsModule} from './common-components/common-components.module';
import {UserContextService, LoadingStatusService, LoadingStatusInterceptor, ApiUrlsService} from './shared/services';
import {SamplesListingComponent} from './samples-listing/samples-listing.component';
import {SamplesListingOptionsComponent} from './samples-listing/listing-options/samples-listing-options.component';
import {TestsSearchComponent} from './tests-search/tests-search.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {AuthTokenHttpInterceptor} from './shared/services/auth-token-http-interceptor';
import {TestsSearchQueryComponent} from './tests-search/query/tests-search-query.component';

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
      MatDatepickerModule,
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
