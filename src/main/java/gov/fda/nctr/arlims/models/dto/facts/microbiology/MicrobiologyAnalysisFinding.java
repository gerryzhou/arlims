package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.Optional;

public class MicrobiologyAnalysisFinding
{
    private String actionIndicator;
    private String subNumberCode;
    private String genusCode;
    private String speciesCode;
    private String secondaryPafCode;
    private String presenceResultIndicator;
    private String atypicalReactionCode;
    private Optional<String> atypicalReactionRemarksText;
    private long isolatesSentNumber;
    private String isolatesSentIndicator;   // "Y" | "N" // why necessary when number sent is also specified?
    private String fdaLabOrgName;
    private Optional<String> remarksText;
    // TODO: Maybe add sampleAnalysisMicrobes.

    protected MicrobiologyAnalysisFinding() {}

    public MicrobiologyAnalysisFinding
        (
            String actionIndicator,
            String subNumberCode,
            String genusCode,
            String speciesCode,
            String secondaryPafCode,
            String presenceResultIndicator,
            String atypicalReactionCode,
            Optional<String> atypicalReactionRemarksText,
            long isolatesSentNumber,
            String isolatesSentIndicator,
            String fdaLabOrgName,
            Optional<String> remarksText
        )
    {
        this.actionIndicator = actionIndicator;
        this.subNumberCode = subNumberCode;
        this.genusCode = genusCode;
        this.speciesCode = speciesCode;
        this.secondaryPafCode = secondaryPafCode;
        this.presenceResultIndicator = presenceResultIndicator;
        this.atypicalReactionCode = atypicalReactionCode;
        this.atypicalReactionRemarksText = atypicalReactionRemarksText;
        this.isolatesSentNumber = isolatesSentNumber;
        this.isolatesSentIndicator = isolatesSentIndicator;
        this.fdaLabOrgName = fdaLabOrgName;
        this.remarksText = remarksText;
    }

    public String getActionIndicator() { return actionIndicator; }

    public String getSubNumberCode() { return subNumberCode; }

    public String getGenusCode() { return genusCode; }

    public String getSpeciesCode() { return speciesCode; }

    public String getSecondaryPafCode() { return secondaryPafCode; }

    public String getPresenceResultIndicator() { return presenceResultIndicator; }

    public String getAtypicalReactionCode() { return atypicalReactionCode; }

    public Optional<String> getAtypicalReactionRemarksText() { return atypicalReactionRemarksText; }

    public long getIsolatesSentNumber() { return isolatesSentNumber; }

    public String getIsolatesSentIndicator() { return isolatesSentIndicator; }

    public String getFdaLabOrgName() { return fdaLabOrgName; }

    public Optional<String> getRemarksText() { return remarksText; }
}
