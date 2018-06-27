package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


public class SampleListMetadata
{
    private long sampleListId;

    private String name;

    private Instant created;

    private String createdByUserShortName;

    public SampleListMetadata
        (
            long sampleListId,
            String name,
            Instant created,
            String createdByUserShortName
        )
    {
        this.sampleListId = sampleListId;
        this.name = name;
        this.created = created;
        this.createdByUserShortName = createdByUserShortName;
    }

    public long getSampleListId() { return sampleListId; }

    public String getName() { return name; }

    public Instant getCreated() { return created; }

    public String getCreatedByUserShortName() { return createdByUserShortName; }
}
