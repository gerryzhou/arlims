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
} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TruncateModule} from '@yellowspot/ng-truncate';

import {AppRoutingModule} from './routing/app-routing.module';
import {AppComponent} from './app.component';
import {LoadingIndicatorService, UserService} from './shared/services';
import {LoadingIndicatorInterceptor} from './shared/services/loading-indicator/loading-indicator-interceptor';
import {AlertMessageComponent} from './alerts/alert-message.component';
import {HomeComponent} from './home/home.component';

@NgModule({
   declarations: [
      AppComponent,
      AlertMessageComponent,
      HomeComponent
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
      LoadingIndicatorService,
      {
         provide: HTTP_INTERCEPTORS,
         useFactory: service => new LoadingIndicatorInterceptor(service),
         multi: true,
         deps: [LoadingIndicatorService]
      },
     UserService,
     {
        provide: APP_INITIALIZER,
        useFactory: userService => () => userService.loadUserContext(),
        deps: [UserService],
        multi: true
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
