package gov.fda.nctr.arlims.models.dto.sample_ops_refresh;


public class SampleOpsRefreshResults
{
    private SampleOpsResults creationResults;
    private SampleOpsResults updateResults;
    private SampleOpsResults unmatchedStatusUpdateResults;

    public SampleOpsRefreshResults(SampleOpsResults creationResults, SampleOpsResults updateResults, SampleOpsResults unmatchedStatusUpdateResults)
    {
        this.creationResults = creationResults;
        this.updateResults = updateResults;
        this.unmatchedStatusUpdateResults = unmatchedStatusUpdateResults;
    }

    public SampleOpsResults getCreationResults() { return creationResults; }

    public SampleOpsResults getUpdateResults() { return updateResults; }

    public SampleOpsResults getUnmatchedStatusUpdateResults() { return unmatchedStatusUpdateResults; }
}
