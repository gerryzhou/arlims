package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.Optional;

public class MicrobiologyIdentification
{
    String biotypeCode;
    String groupCode;
    String preFormedToxinIndicator;
    String serotypeCode;
    String subgroupCode;
    Optional<String> identificationRemarksText;

    public MicrobiologyIdentification
        (
            String biotypeCode,
            String groupCode,
            String preFormedToxinIndicator,
            String serotypeCode,
            String subgroupCode,
            Optional<String> identificationRemarksText
        )
    {
        this.biotypeCode = biotypeCode;
        this.groupCode = groupCode;
        this.preFormedToxinIndicator = preFormedToxinIndicator;
        this.serotypeCode = serotypeCode;
        this.subgroupCode = subgroupCode;
        this.identificationRemarksText = identificationRemarksText;
    }

    protected MicrobiologyIdentification() {}

    public String getBiotypeCode() { return biotypeCode; }

    public String getGroupCode() { return groupCode; }

    public String getPreFormedToxinIndicator() { return preFormedToxinIndicator; }

    public String getSerotypeCode() { return serotypeCode; }

    public String getSubgroupCode() { return subgroupCode; }

    public Optional<String> getIdentificationRemarksText() { return identificationRemarksText; }
}
