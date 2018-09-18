import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {
   DataFieldDiff,
   ParentPathDisplayableFieldDiffs,
   getDisplayableFieldDiffsByFieldParentPath
} from '../../shared/util/data-objects';

@Component({
   selector: 'app-data-field-diffs',
   templateUrl: './data-field-diffs.component.html',
   styleUrls: ['./data-field-diffs.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFieldDiffsComponent implements OnChanges
{
   @Input()
   dataFieldDiffs: DataFieldDiff[];

   parentPathFieldDiffss: ParentPathDisplayableFieldDiffs[];

   constructor() {}

   ngOnChanges(): void
   {
      this.parentPathFieldDiffss = getDisplayableFieldDiffsByFieldParentPath(this.dataFieldDiffs);
   }
}
