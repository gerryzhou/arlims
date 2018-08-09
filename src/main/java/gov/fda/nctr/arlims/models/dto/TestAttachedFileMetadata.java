package gov.fda.nctr.arlims.models.dto;

import java.util.Optional;


public class TestAttachedFileMetadata
{
    private final long attachedFileId;
    private final long testId;
    private final Optional<String> role;
    private final String name;
    private final long size;

    public TestAttachedFileMetadata
        (
            long attachedFileId,
            long testId,
            Optional<String> role,
            String name,
            long size
        )
    {
        this.attachedFileId = attachedFileId;
        this.testId = testId;
        this.role = role;
        this.name = name;
        this.size = size;
    }

    public long getAttachedFileId() { return attachedFileId; }

    public long getTestId() { return testId; }

    public Optional<String> getRole() { return role; }

    public String getName() { return name; }

    public long getSize() { return size; }
}
