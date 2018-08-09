package gov.fda.nctr.arlims.data_access;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.models.dto.*;


public interface TestDataService
{
    long createTest(long empId, long sampleId, LabTestTypeCode testTypeCode, String testBeginDate);

    VersionedTestData getVersionedTestData(long testId);

    boolean saveTestDataJson(long testId, String testDataJson, String stageStatusesJson, long empId, String previousMd5);

    Optional<DataModificationInfo> getTestDataModificationInfo(long testId);

    LabTestMetadata getTestMetadata(long testId);

    List<TestAttachedFileMetadata> getTestAttachedFileMetadatas(long testId);

    long createTestAttachedFile(long testId, Optional<String> role, String name, MultipartFile file);

    void updateTestAttachedFile(long attachedFileId, long testId, Optional<String> role, String name, MultipartFile file);

    void deleteTestAttachedFile(long attachedFileId, long testId);
}
