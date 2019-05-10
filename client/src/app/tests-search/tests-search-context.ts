import {TestTypeSearchScope} from '../../generated/dto';

// Represents the test search capabilities available for the current user / lab group.
export interface TestsSearchContext {

   testTypeSearchScopes: TestTypeSearchScope[];

}
