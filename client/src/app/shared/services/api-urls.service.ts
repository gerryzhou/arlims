import { Injectable } from '@angular/core';
import { Location } from '@angular/common';


@Injectable({providedIn: 'root'})
export class ApiUrlsService {

   constructor(private location: Location) {}

   userContextUrl(): string {
      return this.location.prepareExternalUrl('/api/user/context');
   }

}
