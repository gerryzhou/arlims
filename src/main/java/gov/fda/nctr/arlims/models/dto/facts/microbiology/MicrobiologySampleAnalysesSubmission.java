package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.List;


public class MicrobiologySampleAnalysesSubmission
{
    private List<MicrobiologySampleAnalysis> sampleAnalysisMicrobiologyList;


    public MicrobiologySampleAnalysesSubmission(List<MicrobiologySampleAnalysis> sampleAnalysisMicrobiologyList)
    {
        this.sampleAnalysisMicrobiologyList = sampleAnalysisMicrobiologyList;

        if ( sampleAnalysisMicrobiologyList.isEmpty() )
            throw new RuntimeException("At least one sample analysis is required to make a submission.");
    }

    public List<MicrobiologySampleAnalysis> getSampleAnalysisMicrobiologyList() { return sampleAnalysisMicrobiologyList; }
}
