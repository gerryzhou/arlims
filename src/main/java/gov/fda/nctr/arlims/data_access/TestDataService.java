package gov.fda.nctr.arlims.data_access;

import java.util.Optional;

import gov.fda.nctr.arlims.models.dto.DataModificationInfo;
import gov.fda.nctr.arlims.models.dto.VersionedTestData;


public interface TestDataService
{
    VersionedTestData getVersionedTestData(long testId);

    boolean saveTestDataJson(long testId, String testDataJson, String stageStatusesJson, String previousMd5);

    Optional<DataModificationInfo> getTestDataModificationInfo(long testId);
}
