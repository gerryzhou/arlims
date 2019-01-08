package gov.fda.nctr.arlims.models.dto;

public class CreatedTestMetadata
{
    private long sampleOpId;
    private long createdTestId;

    public CreatedTestMetadata(long sampleOpId, long createdTestId)
    {
        this.sampleOpId = sampleOpId;
        this.createdTestId = createdTestId;
    }

    public long getSampleOpId() { return sampleOpId; }

    public long getCreatedTestId() { return createdTestId; }
}
