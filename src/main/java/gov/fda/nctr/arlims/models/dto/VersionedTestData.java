package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class VersionedTestData
{
    private final long testId;
    private final Optional<String> testDataJson;
    private final DataModificationInfo modInfo;

    public VersionedTestData
        (
            long testId,
            Optional<String> testDataJson,
            DataModificationInfo modInfo
        )
    {
        this.testId = testId;
        this.testDataJson = testDataJson;
        this.modInfo = modInfo;
    }

    public long getTestId() { return testId; }

    public Optional<String> getTestDataJson() { return testDataJson; }

    public DataModificationInfo getModificationInfo() { return modInfo; }
}
