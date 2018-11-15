import {SampleInTest} from './sample-in-test';
import {AppUser, AuditLogEntry, LabResource, TestAttachedFileMetadata, VersionedTestData} from '../../../generated/dto';

/** Versioned test data with sample and test metadata, and optional configuration and managed resources from the owning lab group. */
export interface LabGroupTestData {

   labGroupTestConfig: any | null;

   versionedTestData: VersionedTestData;

   attachedFiles: TestAttachedFileMetadata[];

   sampleInTest: SampleInTest;

   labResourcesByType: Map<string, LabResource[]>;

   auditLogEntries?: AuditLogEntry[] | null;

   appUser: AppUser;
}
