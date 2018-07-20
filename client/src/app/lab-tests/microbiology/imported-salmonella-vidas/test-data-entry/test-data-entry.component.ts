import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiUrlsService, UserContextService} from '../../../../shared/services';
import {VersionedTestData} from '../../../../../generated/dto';
import {emptyTestData, TestData} from '../test-data';
import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {cloneDataObject} from '../../../../shared/util/data-objects';

@Component({
  selector: 'app-test-data-entry',
  templateUrl: './test-data-entry.component.html',
  styleUrls: ['./test-data-entry.component.scss']
})
export class TestDataEntryComponent implements OnInit {

   testData: TestData;
   stageName: string | null;

   // The original test data and its md5 are needed for detecting and merging concurrent updates to the same data.
   originalTestData: TestData;
   originalTestDataMd5: string;

   sampleInTest: SampleInTest;

   constructor(private activatedRoute: ActivatedRoute, private apiUrls: ApiUrlsService, usrCtxSvc: UserContextService) {

      const verTestData: VersionedTestData = this.activatedRoute.snapshot.data['versionedTestData'];

      this.sampleInTest = usrCtxSvc.getSampleInTest(verTestData.testId);
      if ( !this.sampleInTest ) { throw new Error('Sample not found for test id ' + verTestData.testId); }

      this.testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.stageName = activatedRoute.snapshot.paramMap.get('stage') || null;
      this.originalTestData = cloneDataObject(this.testData);
      this.originalTestDataMd5 = verTestData.modificationInfo.dataMd5;
   }

   ngOnInit() {
   }

}
