package gov.fda.nctr.arlims.data_access;

import java.util.Optional;

import gov.fda.nctr.arlims.models.dto.DataModificationInfo;
import gov.fda.nctr.arlims.models.dto.LabTestMetadata;
import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;
import gov.fda.nctr.arlims.models.dto.VersionedTestData;


public interface TestDataService
{
    long createTest(long empId, long sampleId, LabTestTypeCode testTypeCode, String testBeginDate);

    VersionedTestData getVersionedTestData(long testId);

    boolean saveTestDataJson(long testId, String testDataJson, String stageStatusesJson, long empId, String previousMd5);

    Optional<DataModificationInfo> getTestDataModificationInfo(long testId);

    LabTestMetadata getLabTestMetadata(long testId);
}
