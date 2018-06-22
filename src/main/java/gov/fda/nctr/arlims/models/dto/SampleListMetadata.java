package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;


public class SampleListMetadata
{
    private long id;

    private String name;

    private Instant created;

    private UserIdentification createdByUser;

    public SampleListMetadata
        (
            long id,
            String name,
            Instant created,
            UserIdentification createdByUser
        )
    {
        this.id = id;
        this.name = name;
        this.created = created;
        this.createdByUser = createdByUser;
    }

    public long getId() { return id; }

    public String getName() { return name; }

    public Instant getCreated() { return created; }

    public UserIdentification getCreatedByUser() { return createdByUser; }
}
