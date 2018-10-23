import {CanDeactivate} from '@angular/router';
import {StagedTestDataEntryComponent} from '../staged-test-data-entry/staged-test-data-entry.component';

export class TestDataEntryConfirmDeactivateGuard implements CanDeactivate<StagedTestDataEntryComponent> {

   canDeactivate(target: StagedTestDataEntryComponent)
   {
      if ( target.hasUnsavedChanges() )
      {
         return window.confirm('Leave without saving changes?');
      }

      return true;
   }
}
