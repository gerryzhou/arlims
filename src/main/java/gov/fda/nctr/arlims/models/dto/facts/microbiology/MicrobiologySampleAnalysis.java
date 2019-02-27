package gov.fda.nctr.arlims.models.dto.facts.microbiology;

import java.util.List;
import java.util.Optional;


public class MicrobiologySampleAnalysis
{
    private long operationId;
    private String accomplishingOrgName;
    private String performingOrgName;
    private String actionIndicator; // "Y" | "N"
    private String problemCode;
    private String genusCode;
    private String speciesCode;
    private String methodSourceCode;
    private String methodCode;
    private String methodModificationIndicator; // "Y" | "N"
    private String kitTestIndicator;
    private String lowestDilutionTestedCode;
    private String quantifiedIndicator; // "Y" | "N"
    private long subSamplesDetectableFindingsNumber; // (also used for composites case despite the name)
    private Optional<Long> compositesExaminedNumber;
    private Optional<Long> subSamplesUsedCompositeNumber;
    private Optional<Long> subSamplesExaminedNumber;
    private Optional<String> analysisResultsRemarksText;
    private Optional<List<MicrobiologyAnalysisFinding>> analysisMicFindings;
    private Optional<List<MicrobiologyKitTest>> analysisMicKitTests;

    public MicrobiologySampleAnalysis
        (
            long operationId,
            String accomplishingOrgName,
            String performingOrgName,
            String actionIndicator,
            String problemCode,
            String genusCode,
            String speciesCode,
            String methodSourceCode,
            String methodCode,
            String methodModificationIndicator,
            String kitTestIndicator,
            String lowestDilutionTestedCode,
            String quantifiedIndicator,
            long subSamplesDetectableFindingsNumber,
            Optional<Long> compositesExaminedNumber,
            Optional<Long> subSamplesUsedCompositeNumber,
            Optional<Long> subSamplesExaminedNumber,
            Optional<String> analysisResultsRemarksText,
            Optional<List<MicrobiologyAnalysisFinding>> analysisMicFindings,
            Optional<List<MicrobiologyKitTest>> analysisMicKitTests
        )
    {
        this.operationId = operationId;
        this.accomplishingOrgName = accomplishingOrgName;
        this.performingOrgName = performingOrgName;
        this.actionIndicator = actionIndicator;
        this.problemCode = problemCode;
        this.genusCode = genusCode;
        this.speciesCode = speciesCode;
        this.methodSourceCode = methodSourceCode;
        this.methodCode = methodCode;
        this.methodModificationIndicator = methodModificationIndicator;
        this.kitTestIndicator = kitTestIndicator;
        this.lowestDilutionTestedCode = lowestDilutionTestedCode;
        this.quantifiedIndicator = quantifiedIndicator;
        this.subSamplesDetectableFindingsNumber = subSamplesDetectableFindingsNumber;
        this.compositesExaminedNumber = compositesExaminedNumber;
        this.subSamplesUsedCompositeNumber = subSamplesUsedCompositeNumber;
        this.subSamplesExaminedNumber= subSamplesExaminedNumber;
        this.analysisResultsRemarksText = analysisResultsRemarksText;
        this.analysisMicFindings = analysisMicFindings;
        this.analysisMicKitTests = analysisMicKitTests;
    }

    protected MicrobiologySampleAnalysis() {}

    public long getOperationId() { return operationId; }

    public String getAccomplishingOrgName() { return accomplishingOrgName; }

    public String getPerformingOrgName() { return performingOrgName; }

    public String getActionIndicator() { return actionIndicator; }

    public String getProblemCode() { return problemCode; }

    public String getGenusCode() { return genusCode; }

    public String getSpeciesCode() { return speciesCode; }

    public String getMethodSourceCode() { return methodSourceCode; }

    public String getMethodCode() { return methodCode; }

    public String getMethodModificationIndicator() { return methodModificationIndicator; }

    public String getKitTestIndicator() { return kitTestIndicator; }

    public String getLowestDilutionTestedCode() { return lowestDilutionTestedCode; }

    public String getQuantifiedIndicator() { return quantifiedIndicator; }

    public long getSubSamplesDetectableFindingsNumber() { return subSamplesDetectableFindingsNumber; }

    public Optional<Long> getCompositesExaminedNumber() { return compositesExaminedNumber; }

    public Optional<Long> getSubSamplesUsedCompositeNumber() { return subSamplesUsedCompositeNumber; }

    public Optional<Long> getSubSamplesExaminedNumber() { return subSamplesExaminedNumber; }

    public Optional<String> getAnalysisResultsRemarksText() { return analysisResultsRemarksText; }

    public Optional<List<MicrobiologyAnalysisFinding>> getAnalysisMicFindings() { return analysisMicFindings; }

    public Optional<List<MicrobiologyKitTest>> getAnalysisMicKitTests() { return analysisMicKitTests; }
}


