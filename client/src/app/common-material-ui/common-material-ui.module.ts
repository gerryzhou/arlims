import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

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
   MatButtonToggleModule,
   MatDialogModule,
   MatDatepickerModule,
   MatListModule,
   DateAdapter,
   MAT_DATE_LOCALE,
   MAT_DATE_FORMATS,
   MatRadioModule,
   MatStepperModule,
   MatTabsModule,
   MatDividerModule
} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

const matModules = [
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
   MatButtonToggleModule,
   MatDialogModule,
   MatDatepickerModule,
   MatIconModule,
   MatButtonModule,
   MatCardModule,
   MatChipsModule,
   MatTooltipModule,
   MatButtonModule,
   MatSelectModule,
   MatListModule,
   MatMomentDateModule,
   MatRadioModule,
   MatStepperModule,
   MatTabsModule,
   MatDividerModule,
];

@NgModule({
   imports: [CommonModule, ...matModules],
   exports: matModules,
   providers: [
      {
         provide: DateAdapter,
         useClass: MomentDateAdapter,
         deps: [MAT_DATE_LOCALE]
      },
      {
         provide: MAT_DATE_FORMATS,
         useValue: {
            parse: { dateInput: 'YYYY/MM/DD' },
            display: {
               dateInput: 'YYYY/MM/DD',
               monthYearLabel: 'MMM YYYY',
               dateA11yLabel: 'YYYY/MM/DD',
               monthYearA11yLabel: 'MMMM YYYY',
            }
         }
      },
   ]
})
export class CommonMaterialUIModule {}
