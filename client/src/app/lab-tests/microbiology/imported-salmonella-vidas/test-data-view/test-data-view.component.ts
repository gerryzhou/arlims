import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup} from '@angular/forms';

import {SampleInTest} from '../../../../shared/models/sample-in-test';
import {LabGroupTestData} from '../../../../shared/models/lab-group-test-data';
import {LabResource} from '../../../../../generated/dto';
import {EmployeeTimestamp} from '../../../../shared/models/employee-timestamp';
import {emptyTestData, makeTestDataFormGroup} from '../test-data';
import {TestConfig} from '../test-config';
import {makeSampleTestUnits} from '../../sampling-methods';
import {UserContextService} from '../../../../shared/services';

@Component({
   selector: 'app-micro-imp-slm-vidas-test-data-view',
   templateUrl: './test-data-view.component.html',
   styleUrls: ['./test-data-view.component.scss'],
})
export class TestDataViewComponent implements OnInit {

   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   readonly conflictsTestData = emptyTestData();
   readonly conflictsEmployeeTimestamp: EmployeeTimestamp | null;

   sampleTestUnitsCount: number | null;
   sampleTestUnitsType: string | null;

   readonly sampleInTest: SampleInTest;

   readonly testConfig: TestConfig;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;

   constructor
       (
          private activatedRoute: ActivatedRoute,
       )
   {
      const labGroupTestData: LabGroupTestData = this.activatedRoute.snapshot.data['labGroupTestData'];
      const verTestData = labGroupTestData.versionedTestData;
      const testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      this.testDataForm = makeTestDataFormGroup(testData);
      this.testDataForm.disable();
      this.sampleInTest = labGroupTestData.sampleInTest;
      this.testConfig = labGroupTestData.labGroupTestConfig;

      const sm = testData.preEnrData.samplingMethod;
      const sampleTestUnits = makeSampleTestUnits(sm.numberOfSubs, sm.numberOfComposites);
      this.sampleTestUnitsCount = sampleTestUnits.testUnitsCount;
      this.sampleTestUnitsType = sampleTestUnits.testUnitsType;

      const labResources = labGroupTestData.labResourcesByType;
      this.balances = labResources.get(UserContextService.BALANCE_RESOURCE_TYPE);
      this.incubators = labResources.get(UserContextService.INCUBATOR_RESOURCE_TYPE);
      this.waterBaths = labResources.get(UserContextService.WATERBATH_RESOURCE_TYPE);
      this.vidasInstruments = labResources.get(UserContextService.VIDAS_RESOURCE_TYPE);

      this.conflictsTestData = emptyTestData();
      this.conflictsEmployeeTimestamp = null;
   }

   ngOnInit() {}

}
