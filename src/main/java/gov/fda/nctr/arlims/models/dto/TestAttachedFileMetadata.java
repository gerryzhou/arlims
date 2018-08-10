package gov.fda.nctr.arlims.models.dto;

import java.time.Instant;
import java.util.Optional;


public class TestAttachedFileMetadata
{
    private final long attachedFileId;
    private final long testId;
    private final Optional<String> role;
    private final String name;
    private final long size;
    private final Instant uploadedInstant;

    public TestAttachedFileMetadata
        (
            long attachedFileId,
            long testId,
            Optional<String> role,
            String name,
            long size,
            Instant uploadedInstant
        )
    {
        this.attachedFileId = attachedFileId;
        this.testId = testId;
        this.role = role;
        this.name = name;
        this.size = size;
        this.uploadedInstant = uploadedInstant;
    }

    public long getAttachedFileId() { return attachedFileId; }

    public long getTestId() { return testId; }

    public Optional<String> getRole() { return role; }

    public String getName() { return name; }

    public long getSize() { return size; }

    public Instant getUploadedInstant() { return uploadedInstant; }
}
