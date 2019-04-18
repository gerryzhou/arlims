import {Router} from '@angular/router';

export function getNavigationStateItem(router: Router, name: string): any | null
{
   const currNav = router.getCurrentNavigation();
   if ( !currNav )
      return null;

   const extras = currNav.extras;
   if ( !extras )
      return null;

   const state = extras.state;
   if ( !state )
      return null;

   return state[name] || null;
}
