package gov.fda.nctr.arlims.data_access.auditing;

import java.util.Optional;

public class AttachedFileDescription
{
    private final long testAttachedFileId;
    private final String fileName;
    private final long size;
    private final Optional<String> role;

    public AttachedFileDescription(long testAttachedFileId, String fileName, long size, Optional<String> role)
    {
        this.testAttachedFileId = testAttachedFileId;
        this.fileName = fileName;
        this.size = size;
        this.role = role;
    }

    public long getTestAttachedFileId() { return testAttachedFileId; }

    public String getFileName() { return fileName; }

    public long getSize() { return size; }

    public Optional<String> getRole() { return role; }
}
