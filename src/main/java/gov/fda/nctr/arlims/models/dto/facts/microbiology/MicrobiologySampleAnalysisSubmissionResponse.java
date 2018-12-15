package gov.fda.nctr.arlims.models.dto.facts.microbiology;

public class MicrobiologySampleAnalysisSubmissionResponse
{
    private long analysisMicId;

    protected MicrobiologySampleAnalysisSubmissionResponse() {}

    public MicrobiologySampleAnalysisSubmissionResponse(long analysisMicId)
    {
        this.analysisMicId = analysisMicId;
    }

    public long getAnalysisMicId() { return analysisMicId; }
}
