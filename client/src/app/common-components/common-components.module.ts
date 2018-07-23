import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SampleComponent} from './sample/sample.component';
import {TestMetadataComponent} from './test-metadata/test-metadata.component';
import {TestStageStatusComponent} from './test-stage-status/test-stage-status.component';
import {MatCardModule, MatChipsModule, MatTooltipModule, MatButtonModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {DayNumberPipe} from './day-number.pipe';

@NgModule({
   imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatChipsModule,
      MatTooltipModule,
   ],
   declarations: [
      SampleComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      DayNumberPipe,
   ],
   exports: [
      SampleComponent,
      TestMetadataComponent,
      TestStageStatusComponent,
      DayNumberPipe,
   ],
})
export class CommonComponentsModule { }
