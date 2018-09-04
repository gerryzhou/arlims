import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {atomicValueAsString, DataFieldDiff, FieldDiffType} from '../../shared/util/data-objects';

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

   parentPathFieldDiffss: ParentPathFieldDiffs[];

   constructor() {}

   ngOnChanges(changes: SimpleChanges): void
   {
      const changesByParentPath  = new Map<string, FieldDiff[]>();

      for ( const dataFieldDiff of this.dataFieldDiffs )
      {
         const pathComps = dataFieldDiff.path.split('/').map(friendlyFieldPathComponentName);
         const fieldName = pathComps.length > 0 ? pathComps[pathComps.length - 1] : '';
         const parentPath = pathComps.length > 0 ? pathComps.slice(0, pathComps.length - 1).join(' / ').toUpperCase() : '';
         const parentPathDiffs = changesByParentPath.get(parentPath);
         if ( !parentPathDiffs )
            changesByParentPath.set(parentPath, [new FieldDiff(fieldName, dataFieldDiff)]);
         else
            parentPathDiffs.push(new FieldDiff(fieldName, dataFieldDiff));
      }

      const diffs: ParentPathFieldDiffs[] = [];
      for ( const [fieldsParentPath, fieldDiffs] of changesByParentPath.entries() )
      {
         diffs.push({fieldsParentPath, fieldDiffs});
      }
      this.parentPathFieldDiffss = diffs;
   }

}

export function friendlyFieldPathComponentName(pathCompName: string): string
{
   return pathCompName
      .replace(/Data$/g, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
}

interface ParentPathFieldDiffs
{
   fieldsParentPath: string;
   fieldDiffs: FieldDiff[];
}

class FieldDiff
{
   diffType: FieldDiffType;
   fromValue: string;
   toValue: string;

   constructor(public fieldName: string, dataFieldDiff: DataFieldDiff)
   {
      this.diffType = dataFieldDiff.diffType;
      this.fromValue = atomicValueAsString(dataFieldDiff.fromValue);
      this.toValue = atomicValueAsString(dataFieldDiff.toValue);
   }
}

