import {SampleInTest} from './sample-in-test';
import {LabResource, VersionedTestData} from '../../../generated/dto';

/** Versioned test data with sample and test metadata, and optional configuration and managed resources from the owning lab group. */
export interface LabGroupTestData {

   versionedTestData: VersionedTestData;

   sampleInTest: SampleInTest;

   labGroupTestConfig: any;

   labResourcesByType: Map<string, LabResource[]>;
}
