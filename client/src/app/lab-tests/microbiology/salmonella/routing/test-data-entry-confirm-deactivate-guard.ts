import {CanDeactivate} from '@angular/router';
import {StagedTestDataComponent} from '../multi-stage-comps/staged-test-data/staged-test-data.component';

export class TestDataEntryConfirmDeactivateGuard implements CanDeactivate<StagedTestDataComponent> {

   canDeactivate(target: StagedTestDataComponent)
   {
      if ( target.hasUnsavedChanges() )
      {
         return window.confirm('Leave without saving changes?');
      }

      return true;
   }
}
