package gov.fda.nctr.arlims.data_access.test_data;

import java.io.OutputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import gov.fda.nctr.arlims.models.dto.*;


public interface TestDataService
{
    long createTest
        (
            long sampleOpId,
            LabTestTypeCode testTypeCode,
            String testBeginDate,
            long sampleTrackingNumber,
            long sampleTrackingSubNumber,
            String pac,
            String productName,
            Optional<String> lid,
            Optional<String> paf,
            Optional<String> subject,
            AppUser user
        );

    void deleteTest(long testId, AppUser deletingUser);

    VersionedTestData getVersionedTestData(long testId);

    /// Return uppercase md5 hash of saved test data if the save was successful, else empty optional.
    Optional<String> saveTestData(long testId, String testDataJson, String stageStatusesJson, String previousMd5, AppUser user);

    void restoreTestDatas(List<TestSaveData> saveDatas, AppUser user);

    void restoreTestData(long testId, String testDataJson, String stageStatusesJson, AppUser user);

    Optional<DataModificationInfo> getTestDataModificationInfo(long testId);

    LabTestMetadata getTestMetadata(long testId);

    SampleOpTest getSampleOpTestMetadata(long testId);

    List<TestAttachedFileMetadata> getTestAttachedFileMetadatas(long testId);

    List<Long> attachFilesToTest(long testId, List<MultipartFile> files, Optional<String> label, int ordering,  Optional<String> testDataPart, AppUser user);

    void updateTestAttachedFileMetadata(long testId, long attachedFileId, Optional<String> label, int ordering, Optional<String> testDataPart, String name, AppUser user);

    AttachedFileBasicMetadata getTestAttachedFileBasicMetadata(long attachedFileId, long testId);

    void writeTestAttachedFileContentsToStream(long attachedFileId, long testId, OutputStream os);

    void deleteTestAttachedFile(long testId, long attachedFileId, AppUser user);
}
