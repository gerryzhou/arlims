import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
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
   MatSlideToggleModule
} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {LoadingIndicatorService, UserContextService} from './shared/services';
import {LoadingIndicatorInterceptor} from './shared/services/loading-indicator/loading-indicator-interceptor';
import {TestMetadataComponent} from './shared/components/test-metadata/test-metadata.component';
import {SamplesListingComponent} from './samples-listing/samples-listing.component';
import {AlertMessageComponent} from './alerts/alert-message.component';
import {TestStageStatusComponent} from './shared/components/test-stage-status/test-stage-status.component';
import {SampleComponent} from './sample/sample.component';
import {SamplesListingOptionsComponent} from './samples-listing/listing-options/samples-listing-options.component';
import {DayNumberPipe} from './shared/pipes/day-number.pipe';

@NgModule({
   declarations: [
      AppComponent,
      AlertMessageComponent,
      SamplesListingComponent,
      SamplesListingOptionsComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      SampleComponent,
      DayNumberPipe
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
      MatSlideToggleModule,
      AppRoutingModule,
      TruncateModule,
   ],
   providers: [
      Location,
      LoadingIndicatorService,
      {
         provide: HTTP_INTERCEPTORS,
         useFactory: service => new LoadingIndicatorInterceptor(service),
         multi: true,
         deps: [LoadingIndicatorService]
      },
     UserContextService,
     {
        provide: APP_INITIALIZER,
        useFactory: svc => () => svc.loadUserContext(),
        deps: [UserContextService],
        multi: true
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
