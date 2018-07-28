import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as obsof, ReplaySubject} from 'rxjs';

import {ApiUrlsService} from './api-urls.service';
import {UserContext, LabGroupContents, AuthenticatedUser, Sample, LabTestType, LabResource} from '../../../generated/dto';
import {SampleInTest} from '../models/sample-in-test';
import {map} from 'rxjs/operators';

@Injectable()
export class UserContextService {

   public authenticatedUser: AuthenticatedUser;

   private labGroupContents$: ReplaySubject<LabGroupContents>;
   private testIdToSampleInTest$: ReplaySubject<Map<number, SampleInTest>>;
   private testTypeCodeToLabGroupTestConfigJson$: ReplaySubject<Map<string, string>>;
   private labResourcesByType$: ReplaySubject<Map<string, LabResource[]>>;

   private labGroupContentsLastUpdated: Date;

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) {}

   getLabGroupContents(): Observable<LabGroupContents> {
      return this.labGroupContents$;
   }

   loadLabGroupContents() {
      this.loadLabGroupContentsVia(this.fetchLabGroupContents());
      return this.labGroupContents$;
   }

   getSampleInTest(testId: number): Observable<SampleInTest | undefined> {
      return this.testIdToSampleInTest$.pipe(map(m => m.get(testId)));
   }

   getLabGroupTestConfigJson(testTypeCode: string): Observable<string | undefined> {
      return this.testTypeCodeToLabGroupTestConfigJson$.pipe(map(m => m.get(testTypeCode)));
   }

   getLabResourcesByType(): Observable<Map<string, LabResource[]>> {
      return this.labResourcesByType$;
   }

   // Called via app-module to initialize the service prior to usage.
   loadUserContext(): Promise<UserContext> {
      return (
         this.fetchUserContext()
            .toPromise()
            .then(userCtx => {
               this.authenticatedUser = userCtx.authenticatedUser;
               this.loadLabGroupContentsVia(obsof(userCtx.labGroupContents));
               return userCtx;
            })
      );
   }

   private loadLabGroupContentsVia(lgContents$: Observable<LabGroupContents>) {
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

   private fetchUserContext(): Observable<UserContext> {
      return this.httpClient.get<UserContext>(this.apiUrlsSvc.userContextUrl());
   }

   private fetchLabGroupContents(): Observable<LabGroupContents> {
      return this.fetchUserContext().pipe(map(usrCtx => usrCtx.labGroupContents));
   }

   private static getSampleInTestsByTestId(samples: Sample[]): Map<number, SampleInTest> {
      const m = new Map<number, SampleInTest>();
      for (const s of samples) {
         for (const t of s.tests) {
            m.set(t.testId, { sample: s, testMetadata: t });
         }
      }
      return m;
   }

   private static getLabGroupTestConfigJsonsByTestTypeCode(testTypes: LabTestType[]): Map<string, string> {
      const m = new Map<string, string>();
      for (const testType of testTypes) {
         if (testType.configurationJson) {
            m.set(testType.code, testType.configurationJson);
         }
      }
      return m;
   }

   private static groupLabResourcesByType(managedResources: LabResource[]) {
      const m = new Map<string, LabResource[]>();

      for (const labResource of managedResources) {
         const resourcesOfType = m.get(labResource.resourceType);
         if (!resourcesOfType) {
            m[labResource.resourceType] = [labResource];
         } else {
            resourcesOfType.push(labResource);
         }
      }

      return m;
   }
}
