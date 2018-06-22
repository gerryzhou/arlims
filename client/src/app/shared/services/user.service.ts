import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ApiUrlsService} from './api-urls.service';
import {UserContext} from "../../../generated/dto";

@Injectable()
export class UserService {

   public userContext: UserContext;

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) { }

   loadUserContext(): Promise<UserContext> {
      let ucProm: Promise<UserContext> =
         this.httpClient
         .get<UserContext>(this.apiUrlsSvc.userContextUrl())
         .toPromise();

      ucProm.then(userCtx => this.userContext = userCtx);

      return ucProm;
   }

}
