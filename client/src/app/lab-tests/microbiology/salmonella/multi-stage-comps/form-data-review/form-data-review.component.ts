import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormGroup} from '@angular/forms';

import {LabGroupTestData} from '../../../../../shared/client-models/lab-group-test-data';
import {LabResource, TestAttachedFileMetadata, SampleOpTest, AppUser} from '../../../../../../generated/dto';
import {emptyTestData, getVidasPositiveTestUnitNumbers, makeTestDataFormGroup} from '../../test-data';
import {TestConfig} from '../../test-config';
import {UserContextService} from '../../../../../shared/services';
import {AnalyzedAuditLogEntry} from '../../../../../common-components/audit-log-entry/analyzed-audit-log-entry';
import {makeAttachedFilesByTestPartMap} from '../../../../../shared/util/lab-group-data-utils';
import {TestUnitsType} from '../../../sampling-methods';

@Component({
   selector: 'app-micro-slm-form-data-review',
   templateUrl: './form-data-review.component.html',
   styleUrls: ['./form-data-review.component.scss'],
})
export class FormDataReviewComponent implements OnInit {

   // The form group holds the edited state of the test data.
   readonly testDataForm: FormGroup;

   // Controls whether a null option is shown for some ui choice components.
   readonly showUnsetAffordances = false;

   readonly sampleTestUnitsCount: number | null;
   readonly sampleTestUnitsType: TestUnitsType | null;

   readonly vidasPositiveSampleTestUnitNumbers: number[] | null;

   readonly attachedFilesByTestPart: Map<string|null, TestAttachedFileMetadata[]>;

   readonly sampleOpTest: SampleOpTest;

   readonly appUser: AppUser;

   readonly testConfig: TestConfig;

   readonly balances: LabResource[] | undefined;
   readonly incubators: LabResource[] | undefined;
   readonly waterBaths: LabResource[] | undefined;
   readonly vidasInstruments: LabResource[] | undefined;

   readonly analyzedAuditLogEntries: AnalyzedAuditLogEntry[];

   constructor
       (
          private activatedRoute: ActivatedRoute,
       )
   {
      const labGroupTestData: LabGroupTestData = activatedRoute.snapshot.data['labGroupTestData'];

      const verTestData = labGroupTestData.versionedTestData;
      const testData = verTestData.testDataJson ? JSON.parse(verTestData.testDataJson) : emptyTestData();
      const testConfig = labGroupTestData.labGroupTestConfig;
      this.testDataForm = makeTestDataFormGroup(testData, labGroupTestData.appUser.username, testConfig);
      this.testDataForm.disable();
      this.sampleOpTest = labGroupTestData.sampleOpTest;
      this.appUser = labGroupTestData.appUser;
      this.testConfig = labGroupTestData.labGroupTestConfig;

      this.attachedFilesByTestPart = makeAttachedFilesByTestPartMap(labGroupTestData);

      const sm = testData.preEnrData.samplingMethod;
      const sampleTestUnits = {testUnitsType: sm.testUnitsType, testUnitsCount: sm.testUnitsCount};
      this.sampleTestUnitsCount = sampleTestUnits.testUnitsCount;
      this.sampleTestUnitsType = sampleTestUnits.testUnitsType;

      this.vidasPositiveSampleTestUnitNumbers = testData ? getVidasPositiveTestUnitNumbers(testData.vidasData) : [];

      const labResources = labGroupTestData.labResourcesByType;
      this.balances = labResources.get(UserContextService.BALANCE_RESOURCE_TYPE);
      this.incubators = labResources.get(UserContextService.INCUBATOR_RESOURCE_TYPE);
      this.waterBaths = labResources.get(UserContextService.WATERBATH_RESOURCE_TYPE);
      this.vidasInstruments = labResources.get(UserContextService.VIDAS_RESOURCE_TYPE);

      this.analyzedAuditLogEntries = labGroupTestData.auditLogEntries ?
         labGroupTestData.auditLogEntries
            .map(e => new AnalyzedAuditLogEntry(e))
            .filter(ae => !ae.isStructureOnlyTestDataUpdate())
         : [];
   }

   ngOnInit() {}

}
