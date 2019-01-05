package gov.fda.nctr.arlims.models.dto;

public class SampleOpTest
{
    private final SampleOp sampleOp;
    private final LabTestMetadata testMetadata;

    public SampleOpTest(SampleOp sampleOp, LabTestMetadata testMetadata)
    {
        this.sampleOp = sampleOp;
        this.testMetadata = testMetadata;
    }

    public SampleOp getSampleOp() { return sampleOp; }

    public LabTestMetadata getTestMetadata() { return testMetadata; }
}
