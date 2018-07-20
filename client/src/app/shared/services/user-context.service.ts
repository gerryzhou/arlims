import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as obsof} from 'rxjs';

import {ApiUrlsService} from './api-urls.service';
import {UserContext, LabGroupContents, AuthenticatedUser, LabTestMetadata, Sample} from '../../../generated/dto';
import {SampleInTest} from '../models/sample-in-test';

@Injectable()
export class UserContextService {

   public authenticatedUser: AuthenticatedUser;

   private labGroupContents: LabGroupContents;
   private labGroupContentsLastUpdated: Date;
   private testIdToSampleInTest: Map<number, SampleInTest>;

   constructor(private apiUrlsSvc: ApiUrlsService, private httpClient: HttpClient) {}

   public getLabGroupContents(): Observable<LabGroupContents> {
      // TODO: Refresh lab group contents here as needed depending on options and when it was last updated.
      return obsof(this.labGroupContents);
   }

   getSampleInTest(testId: number): SampleInTest | undefined {
      return this.testIdToSampleInTest.get(testId);
   }

   private setUserContext(userContext: UserContext) {
      this.authenticatedUser = userContext.authenticatedUser;
      this.labGroupContents = userContext.labGroupContents;
      this.labGroupContentsLastUpdated = new Date();
      this.testIdToSampleInTest = this.getSampleInTestsByTestId(userContext.labGroupContents.activeSamples);
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

   private getSampleInTestsByTestId(samples: Sample[]) {
      const m = new Map<number, SampleInTest>();

      for (const s of samples) {
         for (const t of s.tests) {
            m.set(t.testId, { sample: s, testMetadata: t });
         }
      }

      return m;
   }
}
