package gov.fda.nctr.arlims.models.dto;

public class SampleInTest
{
    private final Sample sample;
    private final LabTestMetadata testMetadata;

    public SampleInTest(Sample sample, LabTestMetadata testMetadata)
    {
        this.sample = sample;
        this.testMetadata = testMetadata;
    }

    public Sample getSample() { return sample; }

    public LabTestMetadata getTestMetadata() { return testMetadata; }
}
