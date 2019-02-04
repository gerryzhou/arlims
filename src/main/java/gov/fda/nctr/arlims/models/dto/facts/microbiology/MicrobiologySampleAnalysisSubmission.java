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
    private String quantifiedIndicator; // "Y" | "N"
    private String examinedType; // "SUBSAMPLES" | "COMPOSITES"
    private Optional<Long> compositesExaminedNumber;
    private Optional<Long> subSamplesUsedCompositeNumber;
    private Optional<Long> compositesDetectableFindingsNumber;
    private Optional<Long> subSamplesExaminedNumber;
    private Optional<Long> subSamplesDetectableFindingsNumber;
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
            String quantifiedIndicator,
            String examinedType,
            Optional<Long> compositesExaminedNumber,
            Optional<Long> subSamplesUsedCompositeNumber,
            Optional<Long> compositesDetectableFindingsNumber,
            Optional<Long> subSamplesExaminedNumber,
            Optional<Long> subSamplesDetectableFindingsNumber,
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
        this.quantifiedIndicator = quantifiedIndicator;
        this.examinedType = examinedType;
        this.compositesExaminedNumber = compositesExaminedNumber;
        this.subSamplesUsedCompositeNumber = subSamplesUsedCompositeNumber;
        this.compositesDetectableFindingsNumber = compositesDetectableFindingsNumber;
        this.subSamplesExaminedNumber= subSamplesExaminedNumber;
        this.subSamplesDetectableFindingsNumber = subSamplesDetectableFindingsNumber;
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

    public String getQuantifiedIndicator() { return quantifiedIndicator; }

    public String getExaminedType() { return examinedType; }

    public Optional<Long> getCompositesExaminedNumber() { return compositesExaminedNumber; }

    public Optional<Long> getSubSamplesUsedCompositeNumber() { return subSamplesUsedCompositeNumber; }

    public Optional<Long> getCompositesDetectableFindingsNumber() { return compositesDetectableFindingsNumber; }

    public Optional<Long> getSubSamplesExaminedNumber() { return subSamplesExaminedNumber; }

    public Optional<Long> getSubSamplesDetectableFindingsNumber() { return subSamplesDetectableFindingsNumber; }

    public Optional<String> getAnalysisResultsRemarksText() { return analysisResultsRemarksText; }

    public Optional<List<MicrobiologyAnalysisFinding>> getAnalysisMicFindings() { return analysisMicFindings; }

    public Optional<List<MicrobiologyKitTest>> getAnalysisMicKitTests() { return analysisMicKitTests; }
}


