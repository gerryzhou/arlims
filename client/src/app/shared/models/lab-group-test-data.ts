import {SampleInTest} from './sample-in-test';
import {AuditLogEntry, LabResource, VersionedTestData} from '../../../generated/dto';

/** Versioned test data with sample and test metadata, and optional configuration and managed resources from the owning lab group. */
export interface LabGroupTestData {

   versionedTestData: VersionedTestData;

   sampleInTest: SampleInTest;

   labGroupTestConfig: any | null;

   labResourcesByType: Map<string, LabResource[]>;

   auditLogEntries?: AuditLogEntry[] | null;
}
