import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as obsof} from 'rxjs';

import {ApiUrlsService} from './api-urls.service';
import {UserContext, LabGroupContents, AuthenticatedUser} from '../../../generated/dto';

@Injectable()
export class UserContextService {

   public authenticatedUser: AuthenticatedUser;

   private _labGroupContents: LabGroupContents;
   private _labGroupContentsLastUpdated: Date;

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) {}

   public getLabGroupContents(): Observable<LabGroupContents> {
      // TODO: Refresh lab group contents here as needed depending on options and when it was last updated.
      return obsof(this._labGroupContents);
   }

   private setUserContext(userContext: UserContext) {
      this.authenticatedUser = userContext.authenticatedUser;
      this._labGroupContents = userContext.labGroupContents;
      this._labGroupContentsLastUpdated = new Date();
      // TODO: Initialize lookup maps etc from the LabGroupContents as needed (e.g. short name -> UserReference) .
   }

   // Called via app-module to initialize the service prior to usage.
   loadUserContext(): Promise<UserContext> {
      const ucProm: Promise<UserContext> =
         this.httpClient
         .get<UserContext>(this.apiUrlsSvc.userContextUrl())
         .toPromise();

      ucProm.then(userCtx => this.setUserContext(userCtx));

      return ucProm;
   }

}
