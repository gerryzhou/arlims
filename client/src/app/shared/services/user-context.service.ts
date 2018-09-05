import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, EMPTY as emptyObs, Observable, of as obsof, ReplaySubject, throwError} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import {ApiUrlsService} from './api-urls.service';
import {
   UserContext,
   LabGroupContents,
   AppUser,
   Sample,
   LabTestType,
   LabResource,
   LabResourceType, UserRegistration,
} from '../../../generated/dto';
import {SampleInTest} from '../models/sample-in-test';
import {AppInternalUrlsService} from './app-internal-urls.service';
import {Router} from '@angular/router';

@Injectable()
export class UserContextService {

   private readonly authenticatedUser = new BehaviorSubject<AppUser | null>(null);
   private readonly authenticationToken = new BehaviorSubject<string | null>(null);
   private labGroupContentsLastUpdated: Date | null = null;

   private labGroupContents$: ReplaySubject<LabGroupContents>;
   private testIdToSampleInTest$: ReplaySubject<Map<number, SampleInTest>>;
   private testTypeCodeToLabGroupTestConfigJson$: ReplaySubject<Map<string, string>>;
   private labResourcesByType$: ReplaySubject<Map<string, LabResource[]>>;

   static readonly BALANCE_RESOURCE_TYPE: LabResourceType = 'BAL';
   static readonly INCUBATOR_RESOURCE_TYPE: LabResourceType = 'INC';
   static readonly WATERBATH_RESOURCE_TYPE: LabResourceType = 'WAB';
   static readonly VIDAS_RESOURCE_TYPE: LabResourceType = 'VID';

   constructor
      (
         private apiUrlsSvc: ApiUrlsService,
         private appUrlsSvc: AppInternalUrlsService,
         private router: Router,
         private httpClient: HttpClient
      )
   {}

   getAuthenticatedUser(): BehaviorSubject<AppUser | null>
   {
      return this.authenticatedUser;
   }

   getAuthenticationToken(): BehaviorSubject<string | null>
   {
      return this.authenticationToken;
   }

   registerNewUser(userRegistration: UserRegistration): Observable<void>
   {
      const url = this.apiUrlsSvc.registerNewUserUrl();

      return this.httpClient.post<void>(url, userRegistration);
   }

   login(username: string, password: string): Observable<boolean>
   {
      const url = this.apiUrlsSvc.loginUrl();
      const body = new HttpParams().set('username', username).set('password', password);

      this.logout(false);

      return this.httpClient.post<void>(url, body, {observe: 'response'}).pipe(
         flatMap(httpRes => {
            const authHdr = httpRes.headers.get('authorization') || httpRes.headers.get('Authorization');
            const authToken = this.extractAuthToken(authHdr);
            if ( authToken == null )
               return obsof(false);
            this.authenticationToken.next(authToken);
            return this.fetchUserContext().pipe(
               map(userContext => {
                  this.authenticatedUser.next(userContext.user);
                  this.refreshLabGroupContentsVia(obsof(userContext.labGroupContents));
                  return true;
               })
            );
         }),
         catchError((err) => {
            console.log(err);
            this.authenticationToken.next(null);
            return obsof(false);
         })
      );
   }

   logout(navigateToLoginView: boolean = true)
   {
      this.authenticatedUser.next(null);
      this.authenticationToken.next(null);
      this.refreshLabGroupContentsVia(emptyObs);
      if ( navigateToLoginView )
         this.router.navigate(this.appUrlsSvc.login());
   }

   getLabGroupContents(): Observable<LabGroupContents>
   {
      if ( !this.authenticatedUser.getValue() )
         return throwError('authenticated user required for this operation');

      return this.labGroupContents$;
   }

   getSampleInTest(testId: number): Observable<SampleInTest | undefined>
   {
      if ( !this.authenticatedUser.getValue() )
         return throwError('authenticated user required for this operation');

      return this.testIdToSampleInTest$.pipe(map(m => m.get(testId)));
   }

   getLabGroupTestConfigJson(testTypeCode: string): Observable<string | undefined>
   {
      if ( !this.authenticatedUser.getValue() )
         return throwError('authenticated user required for this operation');

      return this.testTypeCodeToLabGroupTestConfigJson$.pipe(map(m => m.get(testTypeCode)));
   }

   getLabResourcesByType(): Observable<Map<string, LabResource[]>>
   {
      if ( !this.authenticatedUser.getValue() )
         return throwError('authenticated user required for this operation');

      return this.labResourcesByType$;
   }

   refreshLabGroupContents(): Observable<LabGroupContents>
   {
      if ( !this.authenticatedUser.getValue() )
         return throwError('authenticated user required for this operation');

      this.refreshLabGroupContentsVia(this.fetchLabGroupContents());
      return this.labGroupContents$;
   }

   private refreshLabGroupContentsVia(lgContents$: Observable<LabGroupContents>)
   {
      this.labGroupContents$ = new ReplaySubject(1);
      this.testIdToSampleInTest$ = new ReplaySubject<Map<number, SampleInTest>>(1);
      this.testTypeCodeToLabGroupTestConfigJson$ = new ReplaySubject<Map<string, string>>(1);
      this.labResourcesByType$ = new ReplaySubject<Map<string, LabResource[]>>(1);

      this.labGroupContents$
         .pipe( map(lgContents => UserContextService.getSampleInTestsByTestId(lgContents.activeSamples)) )
         .subscribe(this.testIdToSampleInTest$);

      this.labGroupContents$
         .pipe( map(lgContents => UserContextService.getLabGroupTestConfigJsonsByTestTypeCode(lgContents.supportedTestTypes)) )
         .subscribe(this.testTypeCodeToLabGroupTestConfigJson$);

      this.labGroupContents$
         .pipe( map(lgContents => UserContextService.groupLabResourcesByType(lgContents.managedResources)) )
         .subscribe(this.labResourcesByType$);

      this.labGroupContents$.subscribe(() => {
         this.labGroupContentsLastUpdated = new Date();
      });

      lgContents$.subscribe(this.labGroupContents$);
   }

   private fetchUserContext(): Observable<UserContext>
   {
      return this.httpClient.get<UserContext>(
         this.apiUrlsSvc.userContextUrl()
      );
   }

   private fetchLabGroupContents(): Observable<LabGroupContents>
   {
      return this.httpClient.get<LabGroupContents>(
         this.apiUrlsSvc.labGroupContentsUrl()
      );
   }

   private static getSampleInTestsByTestId(samples: Sample[]): Map<number, SampleInTest>
   {
      const m = new Map<number, SampleInTest>();
      for (const s of samples) {
         for (const t of s.tests) {
            m.set(t.testId, { sample: s, testMetadata: t });
         }
      }
      return m;
   }

   private static getLabGroupTestConfigJsonsByTestTypeCode(testTypes: LabTestType[]): Map<string, string>
   {
      const m = new Map<string, string>();
      for (const testType of testTypes) {
         if (testType.configurationJson) {
            m.set(testType.code, testType.configurationJson);
         }
      }
      return m;
   }

   private static groupLabResourcesByType(managedResources: LabResource[])
   {
      const m = new Map<string, LabResource[]>();

      for (const labResource of managedResources)
      {
         const resourcesOfType = m.get(labResource.resourceType);
         if (!resourcesOfType)
         {
            m.set(labResource.resourceType, [labResource]);
         }
         else
         {
            resourcesOfType.push(labResource);
         }
      }

      return m;
   }

   private extractAuthToken(authHeader: string): string | null
   {
      if (!authHeader) return null;
      const prefix = 'Bearer ';
      if ( authHeader.startsWith(prefix) )
         return authHeader.substring(prefix.length);
      else
         return authHeader;
   }

}
