import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as obsof} from 'rxjs';

import {ApiUrlsService} from './api-urls.service';
import {UserContext, LabGroupContents, AuthenticatedUser, LabTestMetadata, Sample, LabTestType} from '../../../generated/dto';
import {SampleInTest} from '../models/sample-in-test';
import {map} from 'rxjs/operators';

@Injectable()
export class UserContextService {

   public authenticatedUser: AuthenticatedUser;

   // TODO: Expose as ReplaySubject(1).
   private labGroupContents$: Observable<LabGroupContents>;

   private labGroupContentsLastUpdated: Date;

   // Make these readonly ReplaySubject(1)s.
   private testIdToSampleInTest: Map<number, SampleInTest>;
   private testTypeCodeToLabGroupTestConfigJson: Map<string, string>;

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) {}

   public getLabGroupContents(): Observable<LabGroupContents> {
      return this.labGroupContents$;
   }

   private setLabGroupContents(lgContents: LabGroupContents) {
      this.labGroupContents$ = obsof(lgContents);
      this.labGroupContentsLastUpdated = new Date();

      // TODO: Remove or make observable.
      this.testIdToSampleInTest = this.getSampleInTestsByTestId(lgContents.activeSamples);
      this.testTypeCodeToLabGroupTestConfigJson = this.getLabGroupTestConfigJsonsByTestTypeCode(lgContents.supportedTestTypes);
   }

   requestLabGroupContentsReload() {
      this.labGroupContents$ =
         this.httpClient.get<UserContext>(this.apiUrlsSvc.userContextUrl()).pipe(
            map(userContext => userContext.labGroupContents)
         );
      this.labGroupContents$.subscribe(newLabGroupContents => {
         this.setLabGroupContents(newLabGroupContents);
      });
   }

   ///////////////////////////////////////////////
   // TODO: Expose as observable based on access of the Map ReplaySubject member.
   getSampleInTest(testId: number): SampleInTest | undefined {
      return this.testIdToSampleInTest.get(testId);
   }
   // TODO: Expose as observable based on access of the Map ReplaySubject member.
   getLabGroupTestConfigJson(testTypeCode: string): string | undefined {
      return this.testTypeCodeToLabGroupTestConfigJson.get(testTypeCode);
   }
   // TODO: Make available as ReplaySubject(1).
   private getSampleInTestsByTestId(samples: Sample[]) {
      const m = new Map<number, SampleInTest>();
      for (const s of samples) {
         for (const t of s.tests) {
            m.set(t.testId, { sample: s, testMetadata: t });
         }
      }
      return m;
   }
   // TODO: Make available as ReplaySubject(1).
   private getLabGroupTestConfigJsonsByTestTypeCode(testTypes: LabTestType[]): Map<string, string> {
      const m = new Map<string, string>();
      for (const testType of testTypes) {
         if (testType.configurationJson) {
            m.set(testType.code, testType.configurationJson);
         }
      }
      return m;
   }
   ///////////////////////////////////////////////

   // Called via app-module to initialize the service prior to usage.
   loadUserContext(): Promise<UserContext> {
      const ucProm: Promise<UserContext> =
         this.httpClient
         .get<UserContext>(this.apiUrlsSvc.userContextUrl())
         .toPromise();

      ucProm.then(userCtx => this.setUserContext(userCtx));

      return ucProm;
   }

   private setUserContext(userContext: UserContext) {
      this.authenticatedUser = userContext.authenticatedUser;
      this.setLabGroupContents(userContext.labGroupContents);
   }

}
