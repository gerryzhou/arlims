package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.List;
import java.util.Optional;


public class MicrobiologySampleAnalysisSubmission
{
    private long operationId;
    private String accomplishingOrgName;
    private String actionIndicator; // "Y" | "N"
    private String problemCode;
    private String genusCode;
    private String speciesCode;
    private String methodSourceCode;
    private String methodCode;
    private String methodModificationIndicator; // "Y" | "N"
    private String kitTestIndicator;
    private String examinedType; // "SUBSAMPLES" | "COMPOSITES"
    private long examinedNumber;
    private Optional<Long> subSamplesUsedCompositeNumber;
    private Optional<Long> subSamplesDetectableFindingsNumber;
    private String quantifiedIndicator; // "Y" | "N"
    private Optional<String> analysisResultsRemarksText;
    private Optional<List<MicrobiologyAnalysisFinding>> analysisMicFindings;
    private Optional<List<MicrobiologyKitTest>> analysisMicKitTests;

    public MicrobiologySampleAnalysisSubmission
        (
            long operationId,
            String accomplishingOrgName,
            String actionIndicator,
            String problemCode,
            String genusCode,
            String speciesCode,
            String methodSourceCode,
            String methodCode,
            String methodModificationIndicator,
            String kitTestIndicator,
            String examinedType,
            long examinedNumber,
            Optional<Long> subSamplesUsedCompositeNumber,
            Optional<Long> subSamplesDetectableFindingsNumber,
            String quantifiedIndicator,
            Optional<String> analysisResultsRemarksText,
            Optional<List<MicrobiologyAnalysisFinding>> analysisMicFindings,
            Optional<List<MicrobiologyKitTest>> analysisMicKitTests
        )
    {
        this.operationId = operationId;
        this.accomplishingOrgName = accomplishingOrgName;
        this.actionIndicator = actionIndicator;
        this.problemCode = problemCode;
        this.genusCode = genusCode;
        this.speciesCode = speciesCode;
        this.methodSourceCode = methodSourceCode;
        this.methodCode = methodCode;
        this.methodModificationIndicator = methodModificationIndicator;
        this.kitTestIndicator = kitTestIndicator;
        this.examinedType = examinedType;
        this.examinedNumber = examinedNumber;
        this.subSamplesUsedCompositeNumber = subSamplesUsedCompositeNumber;
        this.subSamplesDetectableFindingsNumber = subSamplesDetectableFindingsNumber;
        this.quantifiedIndicator = quantifiedIndicator;
        this.analysisResultsRemarksText = analysisResultsRemarksText;
        this.analysisMicFindings = analysisMicFindings;
        this.analysisMicKitTests = analysisMicKitTests;
    }

    protected MicrobiologySampleAnalysisSubmission() {}

    public long getOperationId() { return operationId; }

    public String getAccomplishingOrgName() { return accomplishingOrgName; }

    public String getActionIndicator() { return actionIndicator; }

    public String getProblemCode() { return problemCode; }

    public String getGenusCode() { return genusCode; }

    public String getSpeciesCode() { return speciesCode; }

    public String getMethodSourceCode() { return methodSourceCode; }

    public String getMethodCode() { return methodCode; }

    public String getMethodModificationIndicator() { return methodModificationIndicator; }

    public String getKitTestIndicator() { return kitTestIndicator; }

    public String getExaminedType() { return examinedType; }

    public long getExaminedNumber() { return examinedNumber; }

    public Optional<Long> getSubSamplesUsedCompositeNumber() { return subSamplesUsedCompositeNumber; }

    public Optional<Long> getSubSamplesDetectableFindingsNumber() { return subSamplesDetectableFindingsNumber; }

    public String getQuantifiedIndicator() { return quantifiedIndicator; }

    public Optional<String> getAnalysisResultsRemarksText() { return analysisResultsRemarksText; }

    public Optional<List<MicrobiologyAnalysisFinding>> getAnalysisMicFindings() { return analysisMicFindings; }

    public Optional<List<MicrobiologyKitTest>> getAnalysisMicKitTests() { return analysisMicKitTests; }
}


