package gov.fda.nctr.arlims.models.dto.facts.microbiology;

public class CreatedSampleAnalysisMicrobiology
{
    private Long analysisMicId;


    protected CreatedSampleAnalysisMicrobiology() {}

    public CreatedSampleAnalysisMicrobiology(Long analysisMicId)
    {
        this.analysisMicId = analysisMicId;
    }


    public Long getAnalysisMicId() { return analysisMicId; }
}
