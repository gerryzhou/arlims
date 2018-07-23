import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
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
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {LoadingIndicatorService, UserContextService} from './shared/services';
import {LoadingIndicatorInterceptor} from './shared/services/loading-indicator/loading-indicator-interceptor';
import {SamplesListingComponent} from './samples-listing/samples-listing.component';
import {AlertMessageComponent} from './alerts/alert-message.component';
import {SamplesListingOptionsComponent} from './samples-listing/listing-options/samples-listing-options.component';
import {ImportedSalmonellaVidasModule} from './lab-tests/microbiology/imported-salmonella-vidas/imported-salmonella-vidas.module';
import {CommonComponentsModule} from './common-components/common-components.module';

@NgModule({
   declarations: [
      AppComponent,
      AlertMessageComponent,
      SamplesListingComponent,
      SamplesListingOptionsComponent,
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
      TruncateModule,
      // app modules
      AppRoutingModule,
      CommonComponentsModule,
      ImportedSalmonellaVidasModule,
   ],
   providers: [
      Location,
      DatePipe, // for use in JS
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
