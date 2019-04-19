import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import {ApiUrlsService} from './api-urls.service';
import {
   UserContext,
   LabGroupContents,
   AppUser,
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

   private deferredLabGroupContentsRefreshRequested = false;

   // These members are derived from lab group contents and are replaced at every refresh request.
   private labGroupContents$: Promise<LabGroupContents>;
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
      const loginUrl = this.apiUrlsSvc.loginUrl();
      const loginBody = new HttpParams().set('username', username).set('password', password);

      this.logout(false);

      return this.httpClient.post<void>(loginUrl, loginBody, {observe: 'response'}).pipe(
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
            this.authenticationToken$.next(null);

            if ( err.status && err.status === 401 )
               return of(false);
            else
            {
               console.error(
                  'A server side error occurred during the login process: ',
                  err.error && err.error.message || err
               );
               return throwError({message: 'An error occurred on the server.'});
            }
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

   requestDeferredLabGroupContentsRefresh()
   {
      this.deferredLabGroupContentsRefreshRequested = true;
   }

   // The lab group contents with ANALYST-scoped contents.
   getLabGroupContents(): Promise<LabGroupContents>
   {
      if ( this.deferredLabGroupContentsRefreshRequested )
      {
         this.deferredLabGroupContentsRefreshRequested = false;
         return this.refreshLabGroupContents();
      }
      else
         return this.labGroupContents$;
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
      this.refreshLabGroupContentsMembersFrom(this.fetchAnalystScopedLabGroupContents());

      return this.labGroupContents$;
   }

   private refreshLabGroupContentsMembersFrom(contentsSource: Observable<LabGroupContents>)
   {
      const labGroupContents$ = new Subject<LabGroupContents>();

      this.labGroupContents$ = labGroupContents$.toPromise();

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

   private fetchAnalystScopedLabGroupContents(): Observable<LabGroupContents>
   {
      return this.httpClient.get<LabGroupContents>(
         this.apiUrlsSvc.labGroupContentsUrl('ANALYST')
      );
   }

   fetchLabAdminScopedLabGroupContents(): Promise<LabGroupContents>
   {
      return (
         this.httpClient.get<LabGroupContents>(
            this.apiUrlsSvc.labGroupContentsUrl('LABADMIN')
         ).toPromise()
      );
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
