package gov.fda.nctr.arlims.models.dto.facts.sample_ops_refresh;

import java.util.List;


public class SampleOpsResults
{
    private List<SampleOpIdent> succeededSampleOps;
    private List<SampleOpFailure> failedSampleOps;

    public SampleOpsResults(List<SampleOpIdent> succeededSampleOps, List<SampleOpFailure> failedSampleOps)
    {
        this.succeededSampleOps = succeededSampleOps;
        this.failedSampleOps = failedSampleOps;
    }

    public List<SampleOpIdent> getSucceededSampleOps() { return succeededSampleOps; }

    public List<SampleOpFailure> getFailedSampleOps() { return failedSampleOps; }
}


