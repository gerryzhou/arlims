package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.Optional;

public class MicrobiologyAnalysisFinding
{
    private String actionIndicator;
    private String subNumberCode;
    private String presenceResultIndicator;
    private String atypicalReactionCode;
    private Optional<String> atypicalReactionRemarksText;
    private long isolatesSentNumber;
    private String isolatesSentIndicator;   // "Y" | "N" // why necessary when number sent is also specified?
    private long fdaLabOrganizationId; // TODO: Not org name here as elsewhere in api?
    private Optional<String> remarksText;

    // TODO: Resolve discrepancies between api docs and examples.
    // Present in examples but not documented:
    //    genusCode
    //    speciesCode
    //    secondaryPafCode
    //    sampleAnalysisMicrobes    "
    // Documented but not present in examples:
    //    long levelCountNumber;
    //    String levelUnitCode;
    //    String levelQualifierIndicator; // "Y" | "N"

    protected MicrobiologyAnalysisFinding() {}

    public MicrobiologyAnalysisFinding
        (
            String actionIndicator,
            String subNumberCode,
            String presenceResultIndicator,
            String atypicalReactionCode,
            Optional<String> atypicalReactionRemarksText,
            long isolatesSentNumber,
            String isolatesSentIndicator,
            long fdaLabOrganizationId,
            Optional<String> remarksText
        )
    {
        this.actionIndicator = actionIndicator;
        this.subNumberCode = subNumberCode;
        this.presenceResultIndicator = presenceResultIndicator;
        this.atypicalReactionCode = atypicalReactionCode;
        this.atypicalReactionRemarksText = atypicalReactionRemarksText;
        this.isolatesSentNumber = isolatesSentNumber;
        this.isolatesSentIndicator = isolatesSentIndicator;
        this.fdaLabOrganizationId = fdaLabOrganizationId;
        this.remarksText = remarksText;
    }

    public String getActionIndicator() { return actionIndicator; }

    public String getSubNumberCode() { return subNumberCode; }

    public String getPresenceResultIndicator() { return presenceResultIndicator; }

    public String getAtypicalReactionCode() { return atypicalReactionCode; }

    public Optional<String> getAtypicalReactionRemarksText() { return atypicalReactionRemarksText; }

    public long getIsolatesSentNumber() { return isolatesSentNumber; }

    public String getIsolatesSentIndicator() { return isolatesSentIndicator; }

    public long getFdaLabOrganizationId() { return fdaLabOrganizationId; }

    public Optional<String> getRemarksText() { return remarksText; }
}
