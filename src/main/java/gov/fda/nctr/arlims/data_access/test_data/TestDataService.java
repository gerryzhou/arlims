package gov.fda.nctr.arlims.data_access.test_data;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.models.dto.*;


public interface TestDataService
{
    long createTest(long sampleOpId, LabTestTypeCode testTypeCode, String testBeginDate, AppUser user);

    void deleteTest(long testId, AppUser deletingUser);

    VersionedTestData getVersionedTestData(long testId);

    boolean saveTestData(long testId, String testDataJson, String stageStatusesJson, String previousMd5, AppUser user);

    Optional<DataModificationInfo> getTestDataModificationInfo(long testId);

    LabTestMetadata getTestMetadata(long testId);

    List<TestAttachedFileMetadata> getTestAttachedFileMetadatas(long testId);

    List<Long> attachFilesToTest(long testId, List<MultipartFile> files, Optional<String> role, Optional<String> testDataPart, AppUser user);

    void updateTestAttachedFileMetadata(long testId, long attachedFileId, Optional<String> role, Optional<String> testDataPart, String name, AppUser user);

    TestAttachedFileContents getTestAttachedFileContents(long attachedFileId, long testId);

    void deleteTestAttachedFile(long testId, long attachedFileId, AppUser user);

    List<SampleInTest> findTestsContainingText(String searchText);
}
