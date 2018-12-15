package gov.fda.nctr.arlims.models.dto.facts.sample_ops_refresh;


public class SampleOpIdent
{
    Long sampleNum;
    Long sampleSubNum;
    Long opId;

    public SampleOpIdent(Long sampleNum, Long sampleSubNum, Long opId)
    {
        this.sampleNum = sampleNum;
        this.sampleSubNum = sampleSubNum;
        this.opId = opId;
    }

    public Long getSampleNum() { return sampleNum; }

    public Long getSampleSubNum() { return sampleSubNum; }

    public Long getOpId() { return opId; }
}


