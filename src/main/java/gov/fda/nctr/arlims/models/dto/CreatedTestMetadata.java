package gov.fda.nctr.arlims.models.dto;

public class CreatedTestMetadata
{
    private long sampleId;
    private long createdTestId;

    public CreatedTestMetadata(long sampleId, long createdTestId)
    {
        this.sampleId = sampleId;
        this.createdTestId = createdTestId;
    }

    public long getSampleId() { return sampleId; }

    public long getCreatedTestId() { return createdTestId; }
}
