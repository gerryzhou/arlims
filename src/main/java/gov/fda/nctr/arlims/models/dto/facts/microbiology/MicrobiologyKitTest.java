package gov.fda.nctr.arlims.models.dto.facts.microbiology;

public class MicrobiologyKitTest
{
    // TODO: Need to verify these with an example, came from LABSDS GET (not POST) doc, no other example is available.

    private String methodCode;
    private String selectiveAgarText;
    private String genusCode;
    private String spikingGenusSpeciesText;
    private String conventionalMethodResultCode;
    private String rapidMethodResultCode;
    private String selectiveAgarResultCode;
    private String spikingResultCode;
    private long subSamplesDetectableFindingsNumber;
    private long subSamplesUsedCompositeNumber;
    private String kitRemarksText;

    protected MicrobiologyKitTest() {}

    public String getConventionalMethodResultCode() { return conventionalMethodResultCode; }

    public String getGenusCode() { return genusCode; }

    public String getKitRemarksText() { return kitRemarksText; }

    public String getMethodCode() { return methodCode; }

    public String getRapidMethodResultCode() { return rapidMethodResultCode; }

    public String getSelectiveAgarResultCode() { return selectiveAgarResultCode; }

    public String getSelectiveAgarText() { return selectiveAgarText; }

    public String getSpikingGenusSpeciesText() { return spikingGenusSpeciesText; }

    public String getSpikingResultCode() { return spikingResultCode; }

    public long getSubSamplesDetectableFindingsNumber() { return subSamplesDetectableFindingsNumber; }

    public long getSubSamplesUsedCompositeNumber() { return subSamplesUsedCompositeNumber; }
}
