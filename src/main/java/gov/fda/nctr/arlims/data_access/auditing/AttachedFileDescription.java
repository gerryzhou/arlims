package gov.fda.nctr.arlims.data_access.auditing;

import java.util.Optional;

public class AttachedFileDescription
{
    private final long testAttachedFileId;
    private final String fileName;
    private final long size;
    private final Optional<String> role;
    private final Optional<String> testDataField;

    public AttachedFileDescription
        (
            long testAttachedFileId,
            String fileName,
            long size,
            Optional<String> role,
            Optional<String> testDataField
        )
    {
        this.testAttachedFileId = testAttachedFileId;
        this.fileName = fileName;
        this.size = size;
        this.role = role;
        this.testDataField = testDataField;
    }

    public long getTestAttachedFileId() { return testAttachedFileId; }

    public String getFileName() { return fileName; }

    public long getSize() { return size; }

    public Optional<String> getRole() { return role; }

    public Optional<String> getTestDataField() { return testDataField; }
}
