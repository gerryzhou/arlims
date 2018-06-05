import { Injectable } from '@angular/core';
import { Location } from '@angular/common';


@Injectable({providedIn: 'root'})
export class ApiUrlsService {

   constructor(private location: Location) {}

   authenticateUrl(): string {
      return this.location.prepareExternalUrl('/api/login/authenticate');
   }

}
