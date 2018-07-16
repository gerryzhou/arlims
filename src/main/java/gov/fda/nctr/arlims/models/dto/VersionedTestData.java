package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class VersionedTestData
{
    Optional<String> testDataJson;
    String testDataMd5;

    public VersionedTestData
        (
            Optional<String> testDataJson,
            String testDataMd5
        )
    {
        this.testDataJson = testDataJson;
        this.testDataMd5 = testDataMd5;
    }

    public Optional<String> getTestDataJson() { return testDataJson; }

    public String getTestDataMd5() { return testDataMd5; }
}
