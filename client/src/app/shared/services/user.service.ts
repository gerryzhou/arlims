import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiUrlsService} from './api-urls.service';
import {UserContext, LabGroupContents, AuthenticatedUser} from '../../../generated/dto';

@Injectable()
export class UserService {

   public authenticatedUser: AuthenticatedUser;
   public labGroupContents: LabGroupContents;

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) {}

   initWithUserContext(userContext: UserContext) {
      this.authenticatedUser = userContext.authenticatedUser;
      this.labGroupContents = userContext.labGroupContents;
      // TODO: Initialize lookup maps etc from the LabGroupContents as needed (e.g. short name -> UserReference) .
   }

   // Called via app-module to initialize the service prior to usage.
   loadUserContext(): Promise<UserContext> {
      const ucProm: Promise<UserContext> =
         this.httpClient
         .get<UserContext>(this.apiUrlsSvc.userContextUrl())
         .toPromise();

      ucProm.then(userCtx => this.initWithUserContext(userCtx));

      return ucProm;
   }

}
