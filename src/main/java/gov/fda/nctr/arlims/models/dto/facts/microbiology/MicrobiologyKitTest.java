package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.Optional;


public class MicrobiologyKitTest
{
    private String conventionalMethodResultCode;

    private String rapidMethodResultCode;

    private String spikingGenusSpeciesText;

    private String spikingResultCode;

    private String subCompositeNumber;

    private Optional<String> selectiveAgarResultCode;

    private Optional<String> selectiveAgarText;

    private Optional<Long> analysisMicrobiologyKitId;

    private Optional<String> kitRemarks;

    protected MicrobiologyKitTest() {}

    public String getConventionalMethodResultCode() { return conventionalMethodResultCode; }

    public String getRapidMethodResultCode() { return rapidMethodResultCode; }

    public String getSpikingGenusSpeciesText() { return spikingGenusSpeciesText; }

    public String getSpikingResultCode() { return spikingResultCode; }

    public String getSubCompositeNumber() { return subCompositeNumber; }

    public Optional<String> getSelectiveAgarResultCode() { return selectiveAgarResultCode; }

    public Optional<String> getSelectiveAgarText() { return selectiveAgarText; }

    public Optional<Long> getAnalysisMicrobiologyKitId() { return analysisMicrobiologyKitId; }

    public Optional<String> getKitRemarks() { return kitRemarks; }
}
