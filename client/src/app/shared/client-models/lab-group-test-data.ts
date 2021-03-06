import {LabGroupContentsScope, SampleOpTest, UserReference} from '../../../generated/dto';
import {AppUser, AuditLogEntry, LabResource, TestAttachedFileMetadata, VersionedTestData} from '../../../generated/dto';

/** Versioned test data with sample and test metadata, and optional configuration and managed resources from the owning lab group. */
export interface LabGroupTestData {

   labGroupTestConfig: any | null;

   versionedTestData: VersionedTestData;

   attachedFiles: TestAttachedFileMetadata[];

   sampleOpTest: SampleOpTest;

   labGroupContentsScope: LabGroupContentsScope;

   labResourcesByType: Map<string, LabResource[]>;

   labGroupUsers: UserReference[];

   auditLogEntries?: AuditLogEntry[] | null;

   appUser: AppUser;
}
