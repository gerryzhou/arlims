package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


public class SampleListMetadata
{
    private long sampleListId;

    private String name;

    private Instant created;

    private UserReference createdByUser;

    public SampleListMetadata
        (
            long sampleListId,
            String name,
            Instant created,
            UserReference createdByUser
        )
    {
        this.sampleListId = sampleListId;
        this.name = name;
        this.created = created;
        this.createdByUser = createdByUser;
    }

    public long getSampleListId() { return sampleListId; }

    public String getName() { return name; }

    public Instant getCreated() { return created; }

    public UserReference getCreatedByUser() { return createdByUser; }
}
