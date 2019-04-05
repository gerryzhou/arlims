import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import {ApiUrlsService} from './api-urls.service';
import {
   UserContext,
   LabGroupContents,
   AppUser,
   SampleOp,
   SampleOpTest,
   LabTestType,
   LabResource,
   LabResourceType,
   UserRegistration, AppVersion, UserReference,
} from '../../../generated/dto';
import {AppInternalUrlsService} from './app-internal-urls.service';
import {Router} from '@angular/router';

@Injectable()
export class UserContextService {

   private readonly authenticatedUser$ = new BehaviorSubject<AppUser | null>(null);
   private readonly authenticationToken$ = new BehaviorSubject<string | null>(null);
   private readonly applicationVersion$ = new BehaviorSubject<AppVersion | null>(null);
   private labGroupContentsLastUpdated: Date | null = null;

   // These members are derived from lab group contents and are replaced at every refresh request.
   private labGroupContents$: Promise<LabGroupContents>;
   private testIdToSampleOpTest$: Promise<Map<number, SampleOpTest>>;
   private testTypeCodeToLabGroupTestConfigJson$: Promise<Map<string, string>>;
   private labResourcesByType$: Promise<Map<string, LabResource[]>>;
   private labUsers$: Promise<UserReference[]>;

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
      return this.authenticatedUser$;
   }

   getAuthenticationToken(): BehaviorSubject<string | null>
   {
      return this.authenticationToken$;
   }

   getApplicationVersion(): BehaviorSubject<AppVersion | null>
   {
      return this.applicationVersion$;
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
            // If the auth token is in the Authorization header (as opposed to a cookie), then publish the extracted token value.
            const authHdr = httpRes.headers.get('authorization') || httpRes.headers.get('Authorization');
            if ( authHdr != null )
            {
               const authToken = extractAuthToken(authHdr);
               if ( authToken != null )
                  this.authenticationToken$.next(authToken);
            }

            return this.fetchUserContext().pipe(
               map(userContext => {
                  this.authenticatedUser$.next(userContext.user);
                  this.applicationVersion$.next(userContext.applicationVersion || null);
                  this.refreshLabGroupContentsMembersFrom(of(userContext.labGroupContents));
                  return true;
               })
            );
         }),
         catchError((err) => {
            console.log(err);
            this.authenticationToken$.next(null);
            return of(false);
         })
      );
   }

   logout(navigateToLoginView: boolean = true)
   {
      this.authenticatedUser$.next(null);
      this.authenticationToken$.next(null);
      if ( navigateToLoginView )
         this.router.navigate(this.appUrlsSvc.login());
   }

   getLabGroupContents(): Promise<LabGroupContents>
   {
      return this.labGroupContents$;
   }

   getSampleOpTest(testId: number): Promise<SampleOpTest | undefined>
   {
      return this.testIdToSampleOpTest$.then(m => m.get(testId));
   }

   getLabGroupTestConfigJson(testTypeCode: string): Promise<string | undefined>
   {
      return this.testTypeCodeToLabGroupTestConfigJson$.then(m => m.get(testTypeCode));
   }

   getLabResourcesByType(): Promise<Map<string, LabResource[]>>
   {
      return this.labResourcesByType$;
   }

   getLabUsers(): Promise<UserReference[]>
   {
      return this.labUsers$;
   }

   refreshLabGroupContents(): Promise<LabGroupContents>
   {
      this.refreshLabGroupContentsMembersFrom(this.fetchLabGroupContents());

      return this.labGroupContents$;
   }


   private refreshLabGroupContentsMembersFrom(contentsSource: Observable<LabGroupContents>)
   {
      const labGroupContents$ = new Subject<LabGroupContents>();

      this.labGroupContents$ = labGroupContents$.toPromise();

      this.testIdToSampleOpTest$ =
         labGroupContents$
         .pipe(map(lgc => UserContextService.getSampleOpTestsByTestId(lgc.activeSamples)))
         .toPromise();

      this.testTypeCodeToLabGroupTestConfigJson$ =
         labGroupContents$
         .pipe(map(lgc => UserContextService.getLabGroupTestConfigJsonsByTestTypeCode(lgc.supportedTestTypes)))
         .toPromise();

      this.labResourcesByType$ =
         labGroupContents$
         .pipe(map(lgc => groupLabResourcesByType(lgc.managedResources)))
         .toPromise();

      this.labUsers$ =
         labGroupContents$
         .pipe(map(lgc => lgc.memberUsers))
         .toPromise();

      labGroupContents$.subscribe(() => {
         this.labGroupContentsLastUpdated = new Date();
      });

      contentsSource.subscribe(labGroupContents$);
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

   private static getSampleOpTestsByTestId(samples: SampleOp[]): Map<number, SampleOpTest>
   {
      const m = new Map<number, SampleOpTest>();

      for (const s of samples) {
         for (const t of s.tests) {
            m.set(t.testId, { sampleOp: s, testMetadata: t });
         }
      }

      return m;
   }

   private static getLabGroupTestConfigJsonsByTestTypeCode(testTypes: LabTestType[]): Map<string, string>
   {
      const m = new Map<string, string>();
      for ( const testType of testTypes )
      {
         if (testType.configurationJson)
         {
            m.set(testType.code, testType.configurationJson);
         }
      }
      return m;
   }


}

function extractAuthToken(authHeader: string): string | null
{
   if (!authHeader) return null;
   const prefix = 'Bearer ';
   if ( authHeader.startsWith(prefix) )
      return authHeader.substring(prefix.length);
   else
      return authHeader;
}


function groupLabResourcesByType(managedResources: LabResource[]): Map<string, LabResource[]>
{
   const m = new Map<string, LabResource[]>();

   for ( const labResource of managedResources )
    {
       const resourcesOfType = m.get(labResource.resourceType);

       if ( !resourcesOfType )
          m.set(labResource.resourceType, [labResource]);
       else
          resourcesOfType.push(labResource);
    }

   return m;
}
