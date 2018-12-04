package gov.fda.nctr.arlims.models.dto;

public class TestSaveData
{
    private long testId;
    private String testDataJson;
    private String stageStatusesJson;

    TestSaveData() {}

    public TestSaveData(long testId, String testDataJson, String stageStatusesJson, String savedAt)
    {
        this.testId = testId;
        this.testDataJson = testDataJson;
        this.stageStatusesJson = stageStatusesJson;
    }

    public long getTestId() { return testId; }

    public String getTestDataJson() { return testDataJson; }

    public String getStageStatusesJson() { return stageStatusesJson; }
}
