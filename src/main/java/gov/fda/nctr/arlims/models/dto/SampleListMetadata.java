package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


public class SampleListMetadata
{
    private long sampleListId;

    private String name;

    private Instant createdInstant;

    private String createdByUserShortName;

    public SampleListMetadata
        (
            long sampleListId,
            String name,
            Instant createdInstant,
            String createdByUserShortName
        )
    {
        this.sampleListId = sampleListId;
        this.name = name;
        this.createdInstant = createdInstant;
        this.createdByUserShortName = createdByUserShortName;
    }

    public long getSampleListId() { return sampleListId; }

    public String getName() { return name; }

    public Instant getCreatedInstant() { return createdInstant; }

    public String getCreatedByUserShortName() { return createdByUserShortName; }
}
