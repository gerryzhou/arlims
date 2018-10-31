package gov.fda.nctr.arlims.models.dto.sample_ops_refresh;


public class SampleOpFailure
{
    private SampleOpIdent sampleOpIdent;
    private String error;

    public SampleOpFailure(SampleOpIdent sampleOpIdent, String error)
    {
        this.sampleOpIdent = sampleOpIdent;
        this.error = error;
    }

    public SampleOpIdent getSampleOpIdent() { return sampleOpIdent; }

    public String getError() { return error; }
}


