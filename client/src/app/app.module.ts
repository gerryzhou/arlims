import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {Location} from '@angular/common';
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
} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {LoadingIndicatorService} from "./shared/services/loading-indicator/loading-indicator-service";
import {LoadingIndicatorInterceptor} from "./shared/services/loading-indicator/loading-indicator-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    AppRoutingModule,
    TruncateModule,
  ],
  providers: [
     Location,
     // support for loading indicator via http client interceptor
     LoadingIndicatorService,
     { provide: HTTP_INTERCEPTORS, useFactory: service => new LoadingIndicatorInterceptor(service), multi: true, deps: [LoadingIndicatorService] }
     //
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }