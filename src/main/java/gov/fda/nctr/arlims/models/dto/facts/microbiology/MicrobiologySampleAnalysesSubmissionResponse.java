package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.List;


public class MicrobiologySampleAnalysesSubmissionResponse
{
    List<CreatedSampleAnalysisMicrobiology> sampleAnalysisMicrobiologyList;


    protected MicrobiologySampleAnalysesSubmissionResponse() {}

    public MicrobiologySampleAnalysesSubmissionResponse(List<CreatedSampleAnalysisMicrobiology> sampleAnalysisMicrobiologyList)
    {
        this.sampleAnalysisMicrobiologyList = sampleAnalysisMicrobiologyList;
    }


    public List<CreatedSampleAnalysisMicrobiology> getSampleAnalysisMicrobiologyList()
    {
        return sampleAnalysisMicrobiologyList;
    }
}
